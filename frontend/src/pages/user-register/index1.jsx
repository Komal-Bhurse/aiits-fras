
import React, { useState, useRef } from 'react';

const Index = () => {

    const webcamVideo = useRef();

    const startStream = async () => {
        navigator.mediaDevices
            .getUserMedia({
                audio: false,
                video: {
                    facingMode: "user", width: 480,
                    height: 360,
                },
            }).then(newStream => {
                webcamVideo.current.srcObject = newStream;
            });
    };

    return (
        <div className="container">
            <video ref={webcamVideo} autoPlay playsInline className='border rounded'></video>
            <button
                onClick={startStream}>
                Start webcam
            </button>
        </div>
    );
}

export default Index;
