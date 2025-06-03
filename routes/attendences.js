import express from "express";
const router = express.Router();
import Attendance from "../models/attendence.js"
import User from "../models/user.js"
import {getCollegeHoursRange} from "../utils/index.js"

router.post('/sign-in', async (req, res) => {
  const { descriptor } = req.body;

  console.log(descriptor)

  if (!descriptor || !Array.isArray(descriptor)) {
    return res.json({status:false, message: 'Invalid descriptor data' });
  }

  const users = await User.find();
  let bestMatch = { user: null, dist: 1.0 };

  function euclideanDistance(arr1, arr2) {
    return Math.sqrt(
      arr1.reduce((acc, val, i) => acc + Math.pow(val - arr2[i], 2), 0)
    );
  }

  for (const user of users) {
    if (!user.descriptor || user.descriptor.length !== descriptor.length) continue;
    const dist = euclideanDistance(descriptor, user.descriptor);
    if (dist < bestMatch.dist) bestMatch = { user, dist };
  }

  if (bestMatch.dist < 0.6) {

    const now = new Date();
const { start: collegeStart, end: collegeEnd } = getCollegeHoursRange();
if (now < collegeStart || now > collegeEnd) {
  return res.json({ status: false, message: "You can only sign in between 10 AM and 5 PM" });
}



    const alreadyMarked = await Attendance.findOne({
      userId: bestMatch.user._id,
      signInAt: { $gte: start, $lte: end }
    });

    if (alreadyMarked) {
      return res.json({
        status: false,
        message: `Attendance already marked for ${bestMatch.user.name} today`
      });
    }

    await Attendance.create({
      userId: bestMatch.user._id,
      syncedFromOffline: false,
      signInAt: new Date(),
    });
    res.json({status:true, message: `Attendance marked for ${bestMatch.user.name}`, userId: bestMatch.user._id });
  } else {
    res.json({ status:false, message: 'Face not recognized' });
  }
});

router.get('/present', async (req, res) => {
  const { start, end } = getCollegeHoursRange();

    const presentStudents = await Attendance.find({
      signInAt: { $gte: start, $lte: end }
    }).populate('userId'); // Adjust fields as per your User model

    res.json({
      status:true,
      count: presentStudents.length,
      users: presentStudents
    });
});

router.get('/absent', async (req, res) => {
  const { start, end } = getCollegeHoursRange();

    const allUsers = await User.find();

    const presentAttendance = await Attendance.find({
      signInAt: { $gte: start, $lte: end }
    });

    const presentUserIds = new Set(presentAttendance.map(a => a.userId.toString()));

    const absentStudents = allUsers.filter(user => !presentUserIds.has(user._id.toString()));

    res.json({
      status:true,
      count: absentStudents.length,
      users: absentStudents
    });
});



export default router;