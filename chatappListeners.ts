import logger from "./logger";
import { registerSocketListener } from "./server";
import Group from "./models/chat/Group";
import Message from "./models/chat/Message";

registerSocketListener("createGroup", async ({ data, user, success, error }) => {
  try {
    logger.log("User trying to create group:", data);
    const group = await Group.create({ name: data.name, password: data.password });

    await group.addUser(user);
    await group.addAdmin(user);
    await group.setOwner(user);

    // refresh, get the group with the messages and owner
    const refreshedGroup = await Group.findByPk(group.id, {
      include: [
        { model: Message, as: "messages" }
      ]
    });

    success({ group: refreshedGroup });
  } catch (e) {
    logger.error("Error creating group:", e);
    error(e.message.toLowerCase().includes("validation") ? "Group name already taken" : e.message);
  }
}, {
  name: "string",
  password: {
    required: false,
    type: "string"
  }
}, { auth: true });

registerSocketListener("joinGroup", ({ data, user, success, error }) => {
  Group.findOne({ where: { name: data.name } }).then(async (group) => {
    if (!group) return error("Group not found");

    if (group.password && group.password !== data.password) return error("Incorrect password");

    await group.addUser(user);

    success({ group });
  });
}, {
  name: "string",
  password: {
    required: false,
    type: "string"
  }
}, { auth: true });

