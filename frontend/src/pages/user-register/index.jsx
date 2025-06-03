import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import * as faceapi from "face-api.js";


export default function Index() {
    const webcamVideo = useRef(null);

    const [stream, setStream] = useState(true);

    const [capturedImage, setCapturedImage] = useState(null);

    const [name, setName] = useState("");

    const [aadhaar, setAadhaar] = useState("");

    const [descriptor, setDescriptor] = useState("")

    const [step, setStep] = useState(1);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = "/models";
            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            ]);
        };

        loadModels();
    }, []);

    const verifyAddhar = async (e) => {
        e.preventDefault();

        if (!name) {
            return toast.error("Please enter Full Name")
        }

        if (!aadhaar) {
            return toast.error("Please enter Aadhaar No")
        }

        const loading = toast.loading("Verifying!");
        try {
            const verifyRes = await axios.get(`/api/user/verify-aadhaar/${aadhaar}`);
            if (verifyRes.data.status) {
                toast.dismiss(loading);
                toast.success(verifyRes.data.message);
                setStep(2);
            } else {
                toast.dismiss(loading);
                toast.error(verifyRes.data.message);
            }
            
        } catch (error) {
            toast.dismiss(loading);
            toast.error("Somthing went wrong. Please try again !");

        }
    };

    const captureImage = async () => {
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
        setLoading(false)

        const descriptor = Array.from(detection.descriptor);

        setDescriptor(descriptor)

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


    const registerUser = async () => {
        setLoading(true)
        console.log(name, aadhaar, descriptor)
        try {
            await axios.post("/api/user/register", { name, aadhaar, descriptor });
            toast.success("Registered successfully!");
            setLoading(false)
            setStep(1)
            setCapturedImage(null)
            setName("")
            setAadhaar("")
            setDescriptor("")
            setCapturedImage("")
            setStream(true)
        } catch (err) {
            setLoading(false)
        }
    }

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
            stream.getTracks().forEach(track => track.stop());
            if (webcamVideo.current) {
                webcamVideo.current.srcObject = null;
            }
            setStream(null);
        }
    };



    useEffect(() => {
        if (step === 2) {
            startStream()
        }

    }, [step]);

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-10 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h1 className=" text-center text-2xl/9 font-bold tracking-tight text-cyan-700">
                        AIITS
                    </h1>
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-400">
                        Register an User
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    {step === 1 ? (
                        <form onSubmit={verifyAddhar} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm/6 font-medium text-gray-500"
                                >
                                    Full Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="block w-full rounded-md px-3 py-1.5 text-base text-gray-200 outline-none border border-gray-700 placeholder:text-gray-600  sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="aadhaar"
                                        className="block text-sm/6 font-medium text-gray-500"
                                    >
                                        Aadhaar No
                                    </label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="aadhaar"
                                        name="aadhaar"
                                        type="text"
                                        placeholder="Enter Aadhaar No"
                                        value={aadhaar}
                                        onChange={(e) => setAadhaar(e.target.value)}
                                        className="block w-full rounded-md px-3 py-1.5 text-base text-gray-200 outline-none border border-gray-700 placeholder:text-gray-600  sm:text-sm/6"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="cursor-pointer outline-none flex w-full justify-center rounded-md bg-cyan-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-800"
                                >
                                    Verify Aadhaar & Next
                                </button>
                            </div>
                        </form>
                    ) : step === 2 ? (
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

                                        descriptor ?

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

                                                </button> :
                                                <button
                                                    onClick={registerUser}
                                                    type="button"
                                                    className="cursor-pointer outline-none flex w-full justify-center rounded-md bg-cyan-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-800"
                                                >
                                                    Register
                                                </button>
                                            :
                                            <button
                                                onClick={captureImage}
                                                type="button"
                                                className="cursor-pointer outline-none flex w-full justify-center rounded-md bg-cyan-900 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-cyan-800"
                                            >
                                                Capture Image
                                            </button>

                                }

                            </div>
                        </div>
                    ) : null}

                    {/* <p className="mt-10 text-center text-sm/6 text-gray-500">
            Not a member?{' '}
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Start a 14 day free trial
            </a>
          </p> */}
                </div>
            </div>
        </>
    );
}
