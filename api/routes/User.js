import express from "express";
import { UserModel } from "../models/UserModel.js";
import { authorization } from "../middlewares/authUser.js";
const UserRouter = express.Router();

// user/allusers/search=vinay
UserRouter.get("/allusers", authorization, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  // console.log(keyword);
  const users = await UserModel.find(keyword)
    .find({ _id: { $ne: req.user._id } })
    .select("-password");
  // console.log(users);
  res.json(users);
});

export { UserRouter };
