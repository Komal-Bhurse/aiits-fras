import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import axios from "axios";
import { localDB } from "../../utils/localDB";

const UserRegister = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [loadingModels, setLoadingModels] = useState(true);
  const [status, setStatus] = useState("");
  const [aadhaarStatus, setAadhaarStatus] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Sync when online
  useEffect(() => {
    const handleOnline = async () => {
      setIsOnline(true);
      setStatus("🔁 Syncing offline registrations...");
      const unsynced = await localDB.pendingUsers.toArray();

      for (const user of unsynced) {
        try {
          await axios.post("/api/user/register", user);
          await localDB.pendingUsers.delete(user.id);
        } catch (err) {
          console.error("Sync error:", err);
        }
      }

      setStatus("✅ Synced all pending registrations");
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus("📴 You are offline. Data will be saved locally.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setLoadingModels(false);
    };
    loadModels();
  }, []);

  const verifyAadhaar = async () => {
    if (!aadhaar || aadhaar.length !== 14) {
      setAadhaarStatus("Invalid Aadhaar format");
      return;
    }

    try {
      const res = await axios.get(`/api/user/verify-aadhaar/${aadhaar}`);
      if (res.data.message === "verified") {
        setAadhaarStatus("✅ Aadhaar verified");
      } else {
        setAadhaarStatus("❌ Invalid Aadhaar number");
      }
    } catch (err) {
      setAadhaarStatus("❌ Error verifying Aadhaar");
    }
  };

  const handleRegister = async () => {
    setStatus("");

    if (!name || !aadhaar) {
      alert("Please enter both name and Aadhaar number");
      return;
    }
    try {

      const screenshot = webcamRef.current.getScreenshot();
      const img = new Image();
img.src = screenshot;

img.onload = async () => {
  
    
  
    const detection = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();


    if (!detection) {
      alert("No face detected. Try again.");
      return;
    }

    const descriptor = Array.from(detection.descriptor);
    const userData = { name, aadhaar, descriptor };

    if (isOnline) {
      try {
        const res = await axios.post("/api/user/register", userData);
        setStatus("✅ " + res.data.message);
      } catch (err) {
        setStatus("❌ Server error, saving offline");
        await localDB.pendingUsers.add(userData);
      }
    } else {
      await localDB.pendingUsers.add(userData);
      setStatus("📥 Saved locally. Will sync when online.");
    }
    setName("");
    setAadhaar("");
    setAadhaarStatus(null);
  }
      
    } catch (error) {
      console.log(error)
    }

    
    

    
  };

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>User Face Registration</h2>

      {loadingModels ? (
        <p>Loading face-api models... 🔄</p>
      ) : (
        <>
          <Webcam
            ref={webcamRef}
            width={640}
            height={480}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
          />
          <br />

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ padding: 8, margin: 5, width: "250px" }}
          />
          <br />
          <input
            type="text"
            placeholder="Aadhaar Number"
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            onBlur={verifyAadhaar}
            style={{ padding: 8, margin: 5, width: "250px" }}
          />
          {aadhaarStatus && <p>{aadhaarStatus}</p>}
          <br />

          <button onClick={handleRegister} style={{ padding: 10, marginTop: 10 }}>
            📸 Capture & Register
          </button>

          {status && <p style={{ marginTop: 10 }}>{status}</p>}
          <p>Status: {isOnline ? "🟢 Online" : "🔴 Offline"}</p>
        </>
      )}
    </div>
  );
};

export default UserRegister;
