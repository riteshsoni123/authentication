const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  college: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  year: {
    type: Number,
    required: false,
  },
  profession: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("user", UserSchema);
