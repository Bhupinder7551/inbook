const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
  adminname: {
    type: String,
    required: true,
  },
  adminemail: {
    type: String,
    required: true,
    unique:true
  },
  adminpassword: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model('admin',adminSchema);
