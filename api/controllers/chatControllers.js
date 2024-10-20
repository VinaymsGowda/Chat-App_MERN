import Chat from "../models/ChatModel.js";
import { UserModel } from "../models/UserModel.js";
async function accessChat(req, res) {
  //get chat with that user
  const { userid } = req.body;
  // console.log(userid);

  if (!userid) {
    // console.log("User Id not found");
    return res.sendStatus(400);
  }
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //person currently logged in
      { users: { $elemMatch: { $eq: userid } } }, //person whom who u want to chat
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await UserModel.populate(isChat, {
    path: "latestMessage.sender", //what am populating
    select: "username pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userid],
    };
    try {
      const createChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      // console.log(error);
    }
  }
}

async function fetchChats(req, res) {
  try {
    //get chats of this user now

    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await UserModel.populate(chats, {
      path: "latestMessage.sender",
      select: "name profile email",
    });
    res.send(chats);
  } catch (error) {
    // console.log(error);
  }
}

async function createGroupChat(req, res) {
  // console.log("hit");

  if (!req.body.users || !req.body.name) {
    return res.status(404).json({ msg: "Enter all fields" });
  }

  var users = JSON.parse(req.body.users);

  users.push(req.user);
  if (users.length < 2) {
    return res
      .status(404)
      .json({ msg: "Group shoulds have more than 2 members" });
  }

  //put cur user also in user group array

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user, //req.user is from authorization
    });

    //fetch this chat from db and send back to user
    const getChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(201).send(getChat);
  } catch (error) {}
}

async function renameGroup(req, res) {
  const { chatid, newchatname } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatid,
    {
      chatName: newchatname,
    },
    {
      new: true,
    }
  )
    .populate("users", "-passwoed")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    res.status(400);
    res.json({ msg: "Chat Group Not FOund" });
  } else {
    res.json(updateChat);
  }
}

async function addToGroup(req, res) {
  const { chatid, userid } = req.body;

  const added = await Chat.findByIdAndUpdate(chatid, {
    $push: {
      users: userid,
    },
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(400);
    res.json({ msg: "Chat Group Not FOund" });
  } else {
    res.json(added);
  }
}

async function removeFromGroup(req, res) {
  const { chatid, userid } = req.body;
  const removed = await Chat.findByIdAndUpdate(chatid, {
    $pull: {
      users: userid,
    },
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  // console.log(removed);
  if (!removed) {
    res.status(400);
    res.json({ msg: "Chat Group Not FOund" });
  } else {
    res.json({ removed, msg: "From backend" });
  }
}
export {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
