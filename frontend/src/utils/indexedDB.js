export const saveAttendanceOffline = (record) => {
  const dbReq = indexedDB.open('offlineDB', 1);
  dbReq.onupgradeneeded = (e) => {
    const db = e.target.result;
    db.createObjectStore('attendance', { autoIncrement: true });
  };
  dbReq.onsuccess = () => {
    const db = dbReq.result;
    const tx = db.transaction('attendance', 'readwrite');
    tx.objectStore('attendance').add(record);
  };
};

export const syncOfflineData = async () => {
  const dbReq = indexedDB.open('offlineDB', 1);
  dbReq.onsuccess = async () => {
    const db = dbReq.result;
    const tx = db.transaction('attendance', 'readonly');
    const store = tx.objectStore('attendance');
    const getAll = store.getAll();

    getAll.onsuccess = async () => {
      const data = getAll.result;
      if (data.length > 0) {
        await fetch('http://localhost:5000/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ attendanceRecords: data }),
        });
        const txDel = db.transaction('attendance', 'readwrite');
        txDel.objectStore('attendance').clear();
      }
    };
  };
};