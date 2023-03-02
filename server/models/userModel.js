const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  networkStatus: {
    type: String,
    default: "",
  }
});

module.exports = mongoose.model("Users", userSchema);