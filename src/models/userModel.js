const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  fname:String,
  lname:String,
  email:{type:String, required:true},
  password:{type:String, required:true},
  isDeleted:{type:Boolean, default:false},


}, { timestamps: true })

module.exports = mongoose.model("person", userSchema)

