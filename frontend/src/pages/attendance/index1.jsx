// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import * as faceapi from "face-api.js";
// import Dexie from "dexie";
// import axios from "axios";

// // IndexedDB setup for offline attendance
// const db = new Dexie("FaceAttendanceDB");
// db.version(1).stores({
//   offlineAttendance: "++id, userId, timestamp",
// });

// const Attendance = () => {
//   const webcamRef = useRef(null);
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [status, setStatus] = useState("Loading models...");
//   const [matchedName, setMatchedName] = useState(null);

//   // Load face-api.js models
//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await Promise.all([
//           faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
//           faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
//           faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
//         ]);
//         setStatus("✅ Models loaded");
//         setLoading(false);
//       } catch (err) {
//         setStatus("❌ Failed to load models");
//         console.error(err);
//       }
//     };

//     const fetchUsers = async () => {
//       try {
//         const res = await axios.get("/api/user");
//         const formatted = res.data.map((u) => ({
//           ...u,
//           descriptor: new Float32Array(u.descriptor),
//         }));
//         setUsers(formatted);
//       } catch {
//         alert("⚠️ User list failed to load. Attendance will work offline only.");
//       }
//     };

//     loadModels();
//     fetchUsers();
//   }, []);

//   // Attendance logic
//   const matchFace = async () => {
//     const video = webcamRef.current?.video;
//     if (!video || video.readyState !== 4) {
//       alert("Camera not ready.");
//       return;
//     }

//     setStatus("🔍 Detecting face...");
//     console.log("video",video)

//     const detection = await faceapi
//       .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
//       .withFaceLandmarks()
//       .withFaceDescriptor();
//       console.log(detection)

//     if (!detection) {
//       alert("❌ No face detected. Try again.");
//       setStatus("❌ No face detected.");
//       return;
//     }

//     const queryDescriptor = detection.descriptor;
//     const faceMatcher = new faceapi.FaceMatcher(users, 0.5);
//     const bestMatch = faceMatcher.findBestMatch(queryDescriptor);

//     if (bestMatch.label === "unknown") {
//       alert("❌ Face not recognized.");
//       setStatus("❌ Face not recognized.");
//       return;
//     }

//     const matchedUser = users.find((u) => u.name === bestMatch.label);
//     setMatchedName(bestMatch.label);
//     setStatus(`✅ Attendance marked for: ${bestMatch.label}`);

//     const attendanceEntry = {
//       userId: matchedUser._id,
//       timestamp: new Date().toISOString(),
//     };

//     try {
//       await axios.post("/api/attendance/sign-in", attendanceEntry);
//       alert("✅ Attendance marked online.");
//     } catch {
//       await db.offlineAttendance.add(attendanceEntry);
//       alert("⚠️ Offline: Attendance saved locally.");
//     }
//   };

//   // Sync offline attendance on reconnect
//   useEffect(() => {
//     const syncOffline = async () => {
//       const all = await db.offlineAttendance.toArray();
//       for (let entry of all) {
//         try {
//           await axios.post("/api/attendance/sign-in", entry);
//           await db.offlineAttendance.delete(entry.id);
//           console.log("Synced offline attendance for", entry.userId);
//         } catch {
//           console.log("Still offline.");
//         }
//       }
//     };

//     window.addEventListener("online", syncOffline);
//     syncOffline();
//     return () => window.removeEventListener("online", syncOffline);
//   }, []);

//   return (
//     <div style={{ textAlign: "center", padding: "20px" }}>
//       <h2>📷 Face Recognition Attendance</h2>
//       {loading ? (
//         <p>{status}</p>
//       ) : (
//         <>
//         <Webcam
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           width={480}
//           height={360}
//           videoConstraints={{
//             width: 480,
//             height: 360,
//             facingMode: "user",
//           }}
//         />
//           {/* <Webcam
//             ref={webcamRef}
//             audio={false}
//             screenshotFormat="image/jpeg"
//             width={480}
//             height={360}
//             videoConstraints={{ facingMode: "user" }}
//           /> */}
//           <p>{status}</p>
//           <button onClick={matchFace} style={{ padding: "10px 20px", marginTop: "10px" }}>
//             Mark Attendance
//           </button>
//           {matchedName && <p>✅ Attendance for: <strong>{matchedName}</strong></p>}
//         </>
//       )}
//     </div>
//   );
// };

// export default Attendance;

import React from 'react'

function index() {
  return (
    <div>index</div>
  )
}

export default index
