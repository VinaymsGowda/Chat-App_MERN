import express from "express";
import { UserModel } from "../models/UserModel.js";
import genToken from "../config.js/GenToken.js";
import bcrypt from "bcryptjs";
const regRoute = express.Router();
const salt = bcrypt.genSaltSync(10);

regRoute.post("/", async (req, res) => {
  let { data, profile } = req.body;
  const { username, email, password } = data;
  // console.log("Profile ", profile);

  // console.log(username);
  // console.log(password);

  if (!profile) {
    profile =
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
  }

  if (!username || !email || !password) {
    res.status(400);
    res.json({ msg: "Enter All Fields" });
  }

  const dupuser = await UserModel.findOne({ email });
  if (dupuser) {
    res.status(400);
    res.json({ msg: "User Already exists" });
  }

  const newuser = await UserModel.create({
    username,
    email,
    password: bcrypt.hashSync(password, salt),
    profile,
  });

  if (newuser) {
    res.status(201);
    res.json({
      _id: newuser._id,
      email: newuser.email,
      username: newuser.username,
      profile: newuser.profile,
      token: genToken(newuser._id),
    });
    // console.log(newuser);
  } else {
    res.status(400);
    throw new Error("User Not found");
  }
});

export default regRoute;
