import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { db } from "../../utils/indexdb";
import axios from "axios";
import * as faceapi from "face-api.js";
import { useLocation } from "react-router-dom";
import {markAttendanceOffline} from "../../utils/attendances"
import {loadFaceModels} from "../../utils/face-api-models"
import { syncUsersFromServerToLocal, syncAttendanceFromServerToLocal } from "../../utils/syncServerToLocal"
import { syncUsersFromLocalToServer, syncAttendanceFromLocalToServer } from "../../utils/syncLocalToServer"
import { useOnlineStatus } from '../../hooks/checkOnOffStatus';

export default function Index() {
    const isOnline = useOnlineStatus()
    const { pathname } = useLocation();

    const webcamVideo = useRef(null);

    const [stream, setStream] = useState(true);

    const [capturedImage, setCapturedImage] = useState(null);

    const [loading, setLoading] = useState(false);

    
  useEffect(() => {
  const load = async () => {
    try {
      await loadFaceModels(); 
      console.log("Face models loaded successfully");
    } catch (err) {
      console.error("Error loading face models:", err);
    }
  };

  load();
}, []);




    const markAttendance = async () => {
        setLoading(true)
        const loading1 = toast.loading("Capturing image...");
        const video = webcamVideo.current;

        if (!video || video.readyState !== 4) {

            toast.dismiss(loading1);
            toast.error("Camera not ready");
            setLoading(false)
            return;
        }
        toast.dismiss(loading1);

        const loading2 = toast.loading("Detecting face...");

        const detection = await faceapi
            .detectSingleFace(video)
            .withFaceLandmarks()
            .withFaceDescriptor();

        if (!detection) {
            toast.dismiss(loading2);
            toast.error("No face detected. Try again.");
            setLoading(false)
            return;
        }

        captureImageOnCanva(video)

        stopStream()

        toast.dismiss(loading2);
        toast.success("face detected");

        const descriptor = Array.from(detection.descriptor);


        const loading3 = toast.loading("Matching face...")

        try {
            if (window.navigator.onLine) {
                const res = await axios.post("/api/attendance/sign-in", { descriptor });
                if (res.data.status) {
                    toast.dismiss(loading3);
                    toast.success(res.data.message);
                    setCapturedImage("")
                    setStream(true)
                    startStream()
                    setLoading(false)

                } else {
                    toast.dismiss(loading3);
                    toast.error(res.data.message);
                    setCapturedImage("")
                    setStream(true)
                    startStream()
                    setLoading(false)
                }
            } else {
                const result = await markAttendanceOffline(descriptor);

                if (result.status) {
                    toast.dismiss(loading3);
                    toast.success(result.message);
                    setCapturedImage("")
                    setStream(true)
                    startStream()
                    setLoading(false)
                } else {
                    toast.dismiss(loading3);
                    toast.error(result.message);
                    setCapturedImage("")
                    setStream(true)
                    startStream()
                    setLoading(false)
                }
            }
        } catch(err) {
            toast.dismiss(loading3);
            setCapturedImage("")
            setStream(true)
            startStream()
            setLoading(false)
            console.log(err);
        }

    }

    const captureImageOnCanva = (video) => {
        const canvas = document.createElement('canvas');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
    };



    const startStream = () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: "user",
                    width: 480,
                    height: 360,
                },
            })
            .then((newStream) => {
                if (webcamVideo.current) {
                    webcamVideo.current.srcObject = newStream;
                    setStream(newStream);
                } else {
                    console.error("webcamVideo.current is null");
                }
            }).catch(err => {
                console.error("Error accessing camera:", err);
            });
    };


    const stopStream = () => {
        if (stream) {
            stream?.getTracks()?.forEach(track => track.stop());
            if (webcamVideo.current) {
                webcamVideo.current.srcObject = null;
            }
            setStream(null);
        }
    };

    useEffect(() => {
        startStream();
    }, []);

    
    useEffect(() => {

        const handleOnline = async () => {
          await syncUsersFromLocalToServer();
          await syncAttendanceFromLocalToServer();
          await syncUsersFromServerToLocal();
          await syncAttendanceFromServerToLocal();
        };
    
        if (isOnline) {
          handleOnline()
        }

    }, [isOnline]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className=" text-center text-2xl/9 font-bold tracking-tight text-cyan-700">
                        AIITS
                    </h1>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-400">
                        Attendance
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                    <div className="space-y-6">
                        <div>
                            {stream && <video ref={webcamVideo} autoPlay playsInline className='border rounded-xl'></video>
                            }
                            {capturedImage && (
                                <div className="mt-4">
                                    <img src={capturedImage} alt="Captured" className="rounded shadow-md" />
                                </div>
                            )
                            }
                        </div>
                        <div>
                            {
                                loading ?
                                    <button
                                        type="button"
                                        className="cursor-pointer outline-none flex w-full justify-center rounded-md bg-cyan-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-800"
                                    >
                                        <svg
                                            className="mr-3 size-5 animate-spin text-gray-200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>

                                    </button>
                                    :
                                    <button
                                        onClick={markAttendance}
                                        type="button"
                                        className="cursor-pointer outline-none flex w-full justify-center rounded-md bg-cyan-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-800"
                                    >
                                        Mark Attendance
                                    </button>

                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
