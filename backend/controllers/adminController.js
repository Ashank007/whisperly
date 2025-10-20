import User from "../models/User.js";
import Confession from "../models/Confession.js";

export const getAllUsers = async (req, res) => {
  const users = await User.find({}, "-password"); // hide password
  res.json(users);
};

export const getAllConfessions = async (req, res) => {
  const confessions = await Confession.find().populate("user")
  res.json(confessions);
};

export const deleteConfession = async (req, res) => {
  await Confession.findByIdAndDelete(req.params.id);
  res.json({ message: "Confession deleted" });
};

export const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
};
