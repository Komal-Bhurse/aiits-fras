import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import Dexie from "dexie";
import axios from "axios";

// Setup IndexedDB with Dexie
const db = new Dexie("FaceRegisterDB");
db.version(1).stores({ registrations: "++id, name, aadhaar, descriptor" });

const UserRegistration = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const loadModels = async () => {
      setStatus("Loading face-api models...");
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      ]);
      setStatus("Models loaded. Ready.");
      setLoading(false);
    };

    loadModels();
  }, []);

  const captureAndRegister = async () => {
    if (!name || !aadhaar) return alert("Enter all fields");

    // if (!/^[0-9]{12}$/.test(aadhaar)) {
    //   return alert("Invalid Aadhaar number");
    // }

    setStatus("Capturing image...");
    const video = webcamRef.current.video;

  if (!video || video.readyState !== 4) {
    alert("Camera not ready");
    return;
  }


    
      setStatus("Detecting face...");
      const detection = await faceapi
        .detectSingleFace(video)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        alert("No face detected. Try again.");
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      try {
        // Aadhaar verification API
        // const verifyRes = await axios.get(`/api/user/verify-aadhaar/${aadhaar}`);
        // if (verifyRes.data.message !== "verified") {
        //   alert("Aadhaar verification failed");
        //   return;
        // }

        // Try to register online
        await axios.post("/api/user/register", { name, aadhaar, descriptor });
        alert("Registered successfully!");
      } catch (err) {
        console.warn("Offline: storing in IndexedDB", err);
        await db.registrations.add({ name, aadhaar, descriptor });
        alert("No internet. Data saved offline.");
      }

      setName("");
      setAadhaar("");
    
  };

  // Sync offline data on load
  useEffect(() => {
    const syncOfflineData = async () => {
      const data = await db.registrations.toArray();
      if (data.length === 0) return;

      for (let entry of data) {
        try {
          await axios.post("/api/user/register", entry);
          await db.registrations.delete(entry.id);
          console.log("Synced:", entry);
        } catch {
          console.log("Still offline. Try again later.");
        }
      }
    };

    window.addEventListener("online", syncOfflineData);
    syncOfflineData();

    return () => window.removeEventListener("online", syncOfflineData);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>User Registration</h2>
      {loading ? (
        <p>{status}</p>
      ) : (
        <>
          <Webcam
  ref={webcamRef}
  screenshotFormat="image/jpeg"
  width={480}
  height={360}
  videoConstraints={{
    width: 480,
    height: 360,
    facingMode: "user",
  }}
/>

          <div style={{ marginTop: 20 }}>
            <input
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
            />
            <br />
            <input
              type="text"
              value={aadhaar}
              placeholder="Enter Aadhaar"
              onChange={(e) => setAadhaar(e.target.value)}
            />
            <br />
            <button onClick={captureAndRegister}>Capture & Register</button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserRegistration;
