import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import axios from 'axios';
import FaceRecognition from '../../components/FaceRecognition';

function Attendance() {
  // const webcamRef = useRef();
  // const [message, setMessage] = useState('');

  

  // const captureAndMarkAttendance = async () => {
  //   await loadModels();
  //   const image = webcamRef.current.getScreenshot();
  //   const img = await faceapi.fetchImage(image);
  //   const detection = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
  //   if (!detection) return alert('No face detected');

  //   const descriptor = Array.from(detection.descriptor);
  //   console.log(descriptor)
  //   // try {
  //   //   const res = await axios.post('/api/attendance', { descriptor });
  //   //   setMessage(res.data.message);
  //   // } catch (err) {
  //   //   setMessage('Attendance failed');
  //   // }
  // };

  return (
    <div>
      {/* <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={320} height={240} /> */}
      <FaceRecognition/>
      {/* <button onClick={()=>captureAndMarkAttendance()}>Mark Attendance</button> */}
      {/* <p>{message}</p> */}
    </div>
  );
}

export default Attendance;