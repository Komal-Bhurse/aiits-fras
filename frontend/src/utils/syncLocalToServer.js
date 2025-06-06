import { db } from "./indexdb";
import axios from "axios";

export async function syncUsersFromLocalToServer() {
  const queue = await db.syncUserQueue.toArray();

  for (const item of queue) {
    if (item) {
      try {
        const { operation, data } = item;
        const { name, aadhaar, aadhaarVerified, descriptor, addedBy, createdAt } = data

        let res;
        switch (operation) {
          case 'add':
            res = await axios.post('/api/user/register', { name, aadhaar, aadhaarVerified, descriptor, addedBy, createdAt });
            break;
        }



        if (res.data.status) {
          console.log("users synced from local to server")
          await db.syncUserQueue.delete(item.id);
        }


      } catch (err) {
        console.error("Sync failed from local to server:", err);
      }
    } else {
      return;
    }
  }
}

export async function syncAttendanceFromLocalToServer() {
  const queue = await db.syncAttendanceQueue.toArray();

  for (const item of queue) {
    if (item) {
      try {
        const { operation, data } = item;
        const { userId, signInAt } = data

        let res;
        switch (operation) {
          case 'add':
            console.log("syncing addendace local to server")
            res = await axios.post('/api/attendance/sign-in', { userId, signInAt });
            break;
        }

        if (res.data.status) {
                    console.log("attendances synced from local to server")

          await db.syncAttendanceQueue.delete(item.id);
        }


      } catch (err) {
        console.error("Sync failed:", err);
      }
    } else {
      return;
    }
  }
}
