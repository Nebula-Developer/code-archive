import logger from "../logger";
import { Namespace } from "../server/server";
import Group from "../models/chat/Group";
import Message from "../models/chat/Message";
import hash from "../hashing";

export const chatappNamespace = new Namespace("chatapp");

chatappNamespace.addHandler({
  name: "createGroup",
  method: async ({ data, user, success, error }) => {
    try {
      const group = await Group.create({
        name: data.name,
        password: data.password ? await hash.hash(data.password) : null,
      });

      await group.addUser(user!);
      await group.addAdmin(user!);
      await group.setOwner(user!);

      const json = group.toJSON();

      delete json.password;

      success({ group: json });
    } catch (e: any) {
      logger.error("Error creating group:", e);
      error(
        e.message.toLowerCase().includes("validation")
          ? "Group name already taken"
          : e.message
      );
    }
  },
  schema: {
    name: {
      required: true,
      type: "string",
    },
    password: {
      required: false,
      type: "string",
    },
  },
  rules: {
    auth: true,
  },
});

chatappNamespace.addHandler({
  name: "joinGroup",
  method: ({ data, user, success, error, socket }) => {
    Group.findOne({
      where: { name: data.groupName },
      attributes: { include: ["password"] },
    }).then(async (group) => {
      if (!group) return error("Group not found");

      if (
        group.password &&
        !(await hash.compare(data.password, group.password))
      )
        return error("Incorrect password");

      await group.addUser(user!);

      if (data.focus) {
        socket.join("group-" + group.id);

        const messages = await Message.findAll({
          where: { groupId: group.id },
          order: [["id", "DESC"]],
          limit: 10,
        });

        success({ group, messages });
      } else success({ group });
    });
  },
  schema: {
    groupName: {
      required: true,
      type: "string",
    },
    password: {
      required: false,
      type: "string",
    },
    focus: {
      required: false,
      type: "boolean",
    },
  },
  rules: {
    auth: true,
  },
});

chatappNamespace.addHandler({
  name: "leaveGroup",
  method: ({ data, user, success, error }) => {
    Group.findOne({ where: { name: data.groupName } }).then(async (group) => {
      if (!group) return error("Group not found");

      if ((await group.countUsers()) === 1) {
        await group.destroy();
        logger.debug("Group deleted due to no users");
        return success({ deleted: true });
      }

      if (group.ownerId === user!.id) {
        const users = await group.getUsers();
        const newOwner = users.find((u) => u.id !== user!.id);

        if (!newOwner) return error("No other users in the group");

        await group.setOwner(newOwner);
        logger.debug("Group owner changed");
      }

      await group.removeUser(user!);

      success({ deleted: false });
    });
  },
  schema: {
    groupName: {
      required: true,
      type: "string",
    },
  },
  rules: {
    auth: true,
  },
});

chatappNamespace.addHandler({
  name: "sendMessage",
  method: async ({ data, user, success, error }) => {
    const group = await Group.findOne({ where: { name: data.groupName } });
    if (!group) return error("Group not found");

    if (!(await group.hasUser(user!)))
      return error("You are not in this group");

    let message = await Message.create({
      content: data.content,
      groupId: group.id,
      userId: user!.id,
    });

    (message as any) = await Message.findByPk(message.id);

    chatappNamespace.io.to("group-" + group.id).emit("message", message);
    success({ message });
  },
  schema: {
    groupName: {
      required: true,
      type: "string",
    },
    content: {
      required: true,
      type: "string",
    },
  },
  rules: {
    auth: true,
  },
});

chatappNamespace.addHandler({
  name: "listenGroup",
  method: async ({ data, user, success, error, socket }) => {
    const group = await Group.findOne({ where: { name: data.groupName } });
    if (!group) return error("Group not found");

    if (!(await group.hasUser(user!)))
      return error("You are not in this group");

    const messages = await Message.findAll({
      where: { groupId: group.id },
      order: [["id", "DESC"]],
      limit: 10,
    });

    socket.join("group-" + group.id);
    success({ messages });
  },
  schema: {
    groupName: "string",
  },
  rules: {
    auth: true,
  },
});

chatappNamespace.addHandler({
  name: "unlistenGroup",
  method: async ({ data, user, success, error, socket }) => {
    const group = await Group.findOne({ where: { groupName: data.name } });
    if (!group) return error("Group not found");

    if (!(await group.hasUser(user!)))
      return error("You are not in this group");

    socket.leave("group-" + group.id);
    success();
  },
  schema: {
    groupName: "string",
  },
  rules: {
    auth: true,
  },
});
