import { db } from "./indexdb";
import axios from "axios"
import { v4 as uuidv4 } from 'uuid';


// export const getTodayPresentOffline = async () => {
//   const now = new Date();
//   const start = new Date(now.setHours(0, 0, 0, 0));
//   const end = new Date(now.setHours(23, 59, 59, 999));

//   const attendanceToday = await db.attendance
//     .where("signInAt")
//     .between(start, end, true, true)
//     .toArray();

//   const results = [];

//   for (const att of attendanceToday) {
//     const user = await db.users.get(att.userId);
//     if (!user) continue;

//     const aadhaar = maskAadhaar(decryptAadhaar(user.aadhaar, user.aadhaarIV));

//     results.push({
//       _id: att._id,
//       signInAt: att.signInAt,
//       syncedFromOffline: att.syncedFromOffline,
//       userId: {
//         _id: user._id,
//         name: user.name,
//         aadhaar,
//         aadhaarVerified: user.aadhaarVerified,
//         createdAt: user.createdAt
//       }
//     });
//   }

//   return results;
// };


