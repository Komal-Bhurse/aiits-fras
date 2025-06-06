import express from "express";
import { encryptAadhaar, decryptAadhaar, maskAadhaar } from "../utils/index.js"



const router = express.Router();
import Attendance from "../models/attendence.js"
import User from "../models/user.js"
import { getHoursRange, getUTCToISTTime } from "../utils/index.js"

router.post('/sign-in', async (req, res) => {
  const { descriptor, userId,signInAt } = req.body;
  console.log(descriptor,userId,signInAt)

  if(userId){

    const now = new Date();
    const { start: collegeStart, end: collegeEnd } = getHoursRange();

     const alreadyMarked = await Attendance.findOne({
      userId: userId,
      signInAt: { $gte: collegeStart, $lte: collegeEnd }
    });

    if (alreadyMarked) {
      return res.json({
        status: false,
        message: `Attendance already marked for ${alreadyMarked[0]?.name} today`
      });
    }

    const u = await Attendance.create({
      userId: userId,
      signInAt: signInAt,
    });
    res.json({ status: true, message: `Attendance marked for ${u.name}`, userId });
  }else{
if (!descriptor || !Array.isArray(descriptor)) {
    return res.json({ status: false, message: 'Invalid descriptor data' });
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
    const { start: collegeStart, end: collegeEnd } = getHoursRange();

    if (now < collegeStart || now > collegeEnd) {
      return res.json({ status: false, message: `You can only sign in between ${getUTCToISTTime(collegeStart)} and ${getUTCToISTTime(collegeEnd)}` });
    }

    const alreadyMarked = await Attendance.findOne({
      userId: bestMatch.user._id,
      signInAt: { $gte: collegeStart, $lte: collegeEnd }
    });


    if (alreadyMarked) {
      return res.json({
        status: false,
        message: `Attendance already marked for ${bestMatch.user.name} today`
      });
    }

    await Attendance.create({
      userId: bestMatch.user._id,
      signInAt: new Date(),
    });
    res.json({ status: true, message: `Attendance marked for ${bestMatch.user.name}`, userId: bestMatch.user._id });
  } else {
    res.json({ status: false, message: 'Face not recognized' });
  }
  }


  
});

router.get('/present', async (req, res) => {
  const { start, end } = getHoursRange();

  const presentStudents = await Attendance.find({
    signInAt: { $gte: start, $lte: end }
  }).populate({ path: 'userId', select: 'name aadhaar aadhaarVerified aadhaarIV createdAt' }); // Adjust fields as per your User model

  // console.log(presentStudents)
  const allPresentStudents = presentStudents.filter(item => item.userId !== null).map(item => {
    // console.log("item",item)
    const MaskAadhaar = maskAadhaar(decryptAadhaar(item.userId.aadhaar, item.userId.aadhaarIV))
    const data = {
      _id: item._id,
      userId: {
        _id: item.userId._id,
        name: item.userId.name,
        aadhaar: MaskAadhaar,
        aadhaarVerified: item.userId.aadhaarVerified,
        createdAt: item.userId.createdAt
      },
      syncedFromOffline: item.syncedFromOffline,
      signInAt: item.signInAt


    }
    return data;
  })

  res.json({
    status: true,
    count: allPresentStudents.length,
    users: allPresentStudents
  });
});

router.get('/absent', async (req, res) => {
  const { start, end } = getHoursRange();

  const allUsers = await User.find();

  const presentAttendance = await Attendance.find({
    signInAt: { $gte: start, $lte: end }
  });

  const presentUserIds = presentAttendance.length > 0 && new Set(presentAttendance.length > 0 && presentAttendance?.map(a => a?.userId?.toString()));

  if (presentUserIds) {
    const absentStudents = allUsers?.filter(user => !presentUserIds?.has(user?._id?.toString()));

    const allAbsentStudents = absentStudents?.map(item => {
      const MaskAadhaar = maskAadhaar(decryptAadhaar(item.aadhaar, item.aadhaarIV))
      return { _id: item._id, name: item.name, aadhaar: MaskAadhaar, aadhaarVerified: item.aadhaarVerified, addedBy: item.addedBy, createdAt: item.createdAt }
    })

    res.json({
      status: true,
      count: allAbsentStudents.length,
      users: allAbsentStudents
    });
  } else {
    res.json({
      status: true,
      count: allUsers.length,
      users: allUsers
    });
  }


});


router.get('/todays-attendance', async (req, res) => {
  const { start, end } = getHoursRange();

  const presentStudents = await Attendance.find({
    signInAt: { $gte: start, $lte: end }
  }).populate({ path: 'userId', select: 'name aadhaar aadhaarVerified aadhaarIV createdAt' }); // Adjust fields as per your User model

  // console.log(presentStudents)
  const allPresentStudents = presentStudents.filter(item => item.userId !== null).map(item => {
    // console.log("item",item)
    const MaskAadhaar = maskAadhaar(decryptAadhaar(item.userId.aadhaar, item.userId.aadhaarIV))
    const data = {
      _id: item._id,
      userId:item.userId._id,
      user: {
        _id:item.userId._id,
        name: item.userId.name,
        aadhaar: MaskAadhaar,
        aadhaarVerified: item.userId.aadhaarVerified,
        createdAt: item.userId.createdAt
      },
      syncedFromOffline: item.syncedFromOffline,
      signInAt: item.signInAt
    }
    return data;
  })

  res.json({
    status: true,
    count: allPresentStudents.length,
    users: allPresentStudents
  });
});

export default router;