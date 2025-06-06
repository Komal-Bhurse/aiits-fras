import { db } from './indexdb'; // your configured Dexie instance
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';



export async function markAttendanceOffline(descriptor) {
  if (!descriptor || !Array.isArray(descriptor)) {
    return { status: false, message: 'Invalid descriptor data' };
  }

  const users = await db.users.toArray();

  // Euclidean distance function
  function euclideanDistance(arr1, arr2) {
    return Math.sqrt(
      arr1.reduce((acc, val, i) => acc + Math.pow(val - arr2[i], 2), 0)
    );
  }

  // Find best match
  let bestMatch = { user: null, dist: 1.0 };

  for (const user of users) {
    if (!user.descriptor || user.descriptor.length !== descriptor.length) continue;

    const dist = euclideanDistance(descriptor, user.descriptor);
    if (dist < bestMatch.dist) bestMatch = { user, dist };
  }


  if (!bestMatch.user || bestMatch.dist >= 0.6) {
    return { status: false, message: 'Face not recognized (offline)' };
  }

  console.log("bestmatch", bestMatch)

  const now = new Date();
  const start = new Date(); start.setHours(10, 0, 0, 0);
  const end = new Date(); end.setHours(24, 0, 0, 0);

  if (now < start || now > end) {
    return { status: false, message: `You can only sign in between 10:00 AM and 5:00 PM` };
  }

  const today = new Date().toISOString().slice(0, 10);

  const existing = await db.attendance
    .where("userId")
    .equals(bestMatch?.user?._id)
    .toArray();

  console.log("existing attendanec", existing)

  const alreadyMarked = existing?.some(e =>
    e.signInAt.startsWith(today)
  );

  console.log("already marked", alreadyMarked)

  if (alreadyMarked) {
    return { status: false, message: `Already marked for ${bestMatch.user.name} (offline)` };
  }

  await db.attendance.add({
    userId: bestMatch.user._id,
    signInAt: new Date().toISOString()
  });


  await db.syncAttendanceQueue.add({
    operation: "add",
    data: {
      userId: bestMatch.user._id,
      signInAt: new Date().toISOString()
    }
  });

  return { status: true, message: `Marked for ${bestMatch.user.name} (offline)`, userId: bestMatch.user._id };
}


export const getAllUsers = async () => {
  const users = await db.users.toArray();
  return users;
};


export const getAllPresentUsers = async () => {
  const attendances = await db.attendance.toArray();
  return attendances;
};


export const getAllAbsentUsers = async () => {
  const start = new Date();
  start.setHours(10, 0, 0, 0); // Today at 10:00:00 AM

  const end = new Date();
  end.setHours(24, 0, 0, 0); // Today at 5:00:00 PM

  const startISO = start.toISOString();
const endISO = end.toISOString();


  const users = await db.users.toArray();

  const attendanceToday = await db.attendance
    .where("signInAt")
    .between(startISO, endISO)
    .toArray();

    console.log("attendanceToday",attendanceToday)

  const presentUserIds = attendanceToday?.length > 0 && attendanceToday?.map(a => a?.userId);

  if (presentUserIds.length > 0) {

    const absentUsers = users?.filter(user => !presentUserIds?.includes(user?._id));

    return absentUsers.map(user => {
      return {
        _id: user._id,
        name: user.name,
        aadhaar: user.aadhaar,
        aadhaarVerified: user.aadhaarVerified,
        createdAt: user.createdAt
      };
    });
  } else {
    return users;
  }


};


