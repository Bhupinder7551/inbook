const mongoose = require("mongoose");
const {Schema}= mongoose;
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
  Password: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('user', UserSchema);