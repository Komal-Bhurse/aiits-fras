import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {type:String},
  aadhaar: {type:String},
  descriptor: [Number],
  addedBy:{type:String},
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User
