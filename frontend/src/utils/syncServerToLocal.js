import { db } from "./indexdb";
import axios from "axios";

export async function syncUsersFromServerToLocal() {
  try {
    const res = await axios.get('/api/user'); 
    const data = res.data

    if (data?.status && data.users) {
      await db.users.clear(); 
      await db.users.bulkPut(data.users);
      console.log("users have been stored in indexDB from server")
    } else {
      console.log("can't stored users from server to IndexDB")
    }
  } catch (err) {
      console.log(err)
  }
}


export async function syncAttendanceFromServerToLocal() {
  try {
    const res = await axios.get('/api/attendance/todays-attendance'); 
    const data = res.data

    if (data?.status && data.users) {
      await db.attendance.clear(); 
      await db.attendance.bulkPut(data.users);
      console.log("attendances have been stored in indexDB from server")
    } else {
      console.log("can't stored attendances from server to IndexDB")
    }
  } catch (err) {
      console.log(err)
  }
}