const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, avatarImage } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const user = await User.create({
      username,
      avatarImage,
    });
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select([
      "username",
      "avatarImage",
      "_id",
      "networkStatus"
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

module.exports.changeUser = async (req, res, next) => {
  try {
    var id = req.params.id;
    const result = await User.updateOne(
      { "_id": id },
      { $set: { "networkStatus": req.body.status } }
    ).exec();
    if (result.modifiedCount === 1) {
      res.send("User updated successfully");
    } else {
      res.send("User not found or not updated");
    }
  } catch (ex) {
    next(ex)
  }
}