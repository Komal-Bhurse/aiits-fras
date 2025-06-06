import Dexie from 'dexie';

export const db = new Dexie("aiits-fras");

db.version(1).stores({
  users: "++id,name, aadhaar, aadhaarVerified, descriptor, createdAt",
  attendance: "++id, userId,user,signInAt",
  models: 'name',
  syncUserQueue: "++id, operation, data",
  syncAttendanceQueue: "++id, operation, data"
});
