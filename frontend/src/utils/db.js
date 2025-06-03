// Updated IndexedDB implementation using Dexie.js

// client/src/utils/db.js
import Dexie from 'dexie';

const db = new Dexie('offlineDB');
db.version(1).stores({
  attendance: '++id, userId, timestamp, syncedFromOffline'
});

export const saveAttendanceOffline = async (record) => {
  await db.attendance.add(record);
};

export const syncOfflineData = async () => {
  const records = await db.attendance.toArray();
  if (records.length > 0) {
    await fetch('http://localhost:5000/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendanceRecords: records }),
    });
    await db.attendance.clear();
  }
};

// Make sure to update all imports from `indexedDB.js` to `db.js` in your React components
