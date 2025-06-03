// src/localDB.js
import Dexie from "dexie";

export const localDB = new Dexie("faceRegisterDB");

localDB.version(1).stores({
  pendingUsers: "++id,name,aadhaar", // You can index aadhaar
});
