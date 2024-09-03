import logger from "../logger";
import { io, Namespace } from "./server";
import Group from "../models/chat/Group";
import Message from "../models/chat/Message";
import hash from "../hashing";

// var ns = new Namespace("/test");

// ns.addHandler({
//   name: "testing",
//   schema: {
//     text: "string"
//   },
//   method: async ({ data, success }) => {
//     logger.log("Received data:", data);
//     success({ text: data.text });
//   },
//   rules: {
//     auth: true
//   }
// });

// registerSocketListener(
//   "createGroup",
//   async ({ data, user, success, error }) => {
//     try {
//       logger.log("User trying to create group:", data);
//       const group = await Group.create({
//         name: data.name,
//         password: data.password ? await hash.hash(data.password) : null,
//       });

//       await group.addUser(user!);
//       await group.addAdmin(user!);
//       await group.setOwner(user!);

//       const json = group.toJSON();

//       delete json.password;

//       success({ group: json });
//     } catch (e: any) {
//       logger.error("Error creating group:", e);
//       error(
//         e.message.toLowerCase().includes("validation")
//           ? "Group name already taken"
//           : e.message
//       );
//     }
//   },
//   {
//     name: "string",
//     password: {
//       required: false,
//       type: "string",
//     },
//   },
//   { auth: true }
// );

// registerSocketListener(
//   "joinGroup",
//   ({ data, user, success, error }) => {
//     Group.findOne({ where: { name: data.name } }).then(async (group) => {
//       if (!group) return error("Group not found");

//       if (group.password && !await hash.compare(data.password, group.password))
//         return error("Incorrect password");

//       await group.addUser(user!);

//       success({ group });
//     });
//   },
//   {
//     name: "string",
//     password: {
//       required: false,
//       type: "string",
//     },
//   },
//   { auth: true }
// );

// registerSocketListener(
//   "leaveGroup",
//   ({ data, user, success, error }) => {
//     Group.findOne({ where: { name: data.name } }).then(async (group) => {
//       if (!group) return error("Group not found");

//       await group.removeUser(user!);

//       success();
//     });
//   },
//   {
//     name: "string",
//   },
//   { auth: true }
// );

// registerSocketListener(
//   "sendMessage",
//   async ({ data, user, success, error }) => {
//     const group = await Group.findOne({ where: { name: data.groupName } });
//     if (!group) return error("Group not found");

//     if (!(await group.hasUser(user!)))
//       return error("You are not in this group");

//     let message = await Message.create({
//       content: data.content,
//       groupId: group.id,
//       userId: user!.id,
//     });

//     (message as any) = await Message.findByPk(message.id);

//     io.to("group-" + data.groupName).emit("message", { message });
//     success({ message });
//   },
//   {
//     groupName: "string",
//     content: "string",
//   },
//   { auth: true }
// );

// registerSocketListener(
//   "focusGroup",
//   async ({ data, user, success, error, socket }) => {
//     const group = await Group.findOne({
//       where: { name: data.name },
//       include: [{
//         model: Message,
//         as: "messages",
//         limit: 25,
//         order: [["createdAt", "DESC"]],
//       }],
//     });
//     if (!group) return error("Group not found");

//     if (!(await group.hasUser(user!)))
//       return error("You are not in this group");

//     socket.join("group-" + data.name);

//     success({ group });
//   },
//   {
//     name: "string",
//   },
//   { auth: true }
// );

// registerSocketListener(
//   "unfocusGroup",
//   ({ data, success, socket }) => {
//     socket.leave("group-" + data.name);
//     success();
//   },
//   {
//     name: "string",
//   },
//   { auth: true }
// );

export const chatappNamespace = new Namespace("chatapp");

chatappNamespace.addHandler({
  name: "createGroup",
  method: async ({ data, user, success, error }) => {
    try {
      logger.log("User trying to create group:", data);
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
  method: ({ data, user, success, error }) => {
    Group.findOne({ where: { name: data.name } }).then(async (group) => {
      if (!group) return error("Group not found");

      if (group.password && !(await hash.compare(data.password, group.password)))
        return error("Incorrect password");

      await group.addUser(user!);

      success({ group });
    });
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
  name: "leaveGroup",
  method: ({ data, user, success, error }) => {
    Group.findOne({ where: { name: data.name } }).then(async (group) => {
      if (!group) return error("Group not found");

      await group.removeUser(user!);

      success();
    });
  },
  schema: {
    name: {
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

    chatappNamespace.io.to("group-" + data.groupName).emit("message", { message });
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
