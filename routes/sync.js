import express from "express";
const router = express.Router();
import Attendance from "../models/attendence.js"

router.post('/api/sync', async (req, res) => {
  const { attendanceRecords } = req.body;
  for (const record of attendanceRecords) {
    await Attendance.create({ ...record, syncedFromOffline: true });
  }
  res.json({ message: 'Synced successfully' });
});

export default router;