const mongoose = require('mongoose');

const uri= "mongodb://localhost:27017/admin";

const connectToDb=()=> {
     mongoose.connect(uri,()=>{
         console.log("Database connected successfully");
     });
  }
  module.exports= connectToDb;