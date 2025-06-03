import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId,ref: "User"},
  syncedFromOffline: {type:Boolean},
  signInAt:{ type: Date, default: Date.now },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance