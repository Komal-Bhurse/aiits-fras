// src/faceDB.js
import Dexie from 'dexie';

export const faceDB = new Dexie("FaceDB");

faceDB.version(1).stores({
  faces: "++id, name, descriptor"
});

export default faceDB;
