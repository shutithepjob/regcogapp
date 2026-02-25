'use client'

import { useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';

export default function FaceCompareDetection() {

    const [modelsLoaded, setModelsIsLoaded] = useState(false);
    const [image1, setImage1] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [result, setResult] = useState<string>("");

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/models';
            try {
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                console.log("Load Pass1");
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                console.log("Load Pass2");
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
                console.log("Load Pass3");
                setModelsIsLoaded(true);
            } catch (error) {
                console.log("Error ModelLoad : " + error);
            }
        };
        loadModels();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: Function) => {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    const compareFaces = async () => {
        if (!image1 || !image2) return alert("กรุณาอัพโหลดให้ครบ 2 รูป");
        setResult("กำลังประมวลผล...");

        const img1 = await faceapi.fetchImage(image1);
        const img2 = await faceapi.fetchImage(image2);

        const option = new faceapi.TinyFaceDetectorOptions(
            {
                inputSize: 512,
                scoreThreshold: 0.1
            }
        );

        const desc1 = await faceapi.detectSingleFace(img1, option)
            .withFaceLandmarks().withFaceDescriptor();
        const desc2 = await faceapi.detectSingleFace(img2, option)
            .withFaceLandmarks().withFaceDescriptor();

        if (!desc1 && !desc2) {
            setResult("ไม่พบใบหน้าในรูป 1 และรูป 2");
            return;
        }
        else if (!desc1) {
            setResult("ไม่พบใบหน้าในรูป 1");
            return;
        }
        else if (!desc2) {
            setResult("ไม่พบใบหน้าในรูป 2");
            return;
        }

        const distance = faceapi.euclideanDistance(desc1.descriptor, desc2.descriptor);
        console.log("distance : " + distance);
        if (distance < 0.3) {
            setResult(`เป็นคนเดียวกัน (ค่าความต่าง: ${distance.toFixed(4)}) `);
        } else {
            setResult(`คนละคนกัน (ค่าความต่าง: ${distance.toFixed(4)})`);
        }
    };

    return (
        <div className="flex m-2 items-center justify-center flex-col bg-white">
            <h1 className="text-2xl font-bold">ระบบตรวจเช็คใบหน้า</h1>
            {!modelsLoaded && <p>กำลังโหลด Models...</p>}
            <div className="flex gap-4">
                <div>
                    <p>รูปที่ 1</p>
                    <input
                        type="file"
                        onChange={(e) => {
                            handleImageChange(e, setImage1)
                        }}
                    />
                    {
                        image1 &&
                        <img
                            src={image1}
                            className="w-40 h-40 object-cover mt-2"
                        />
                    }
                </div>
                <div>
                    <p>รูปที่ 2</p>
                    <input
                        type="file"
                        onChange={(e) => {
                            handleImageChange(e, setImage2)
                        }}
                    />
                    {
                        image2 &&
                        <img
                            src={image2}
                            className="w-40 h-40 object-cover mt-2"
                        />
                    }
                </div>
            </div>

            <button
                onClick={compareFaces}
                disabled={!modelsLoaded}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg disabled:bg-gray-400"
            >
                เปรียบเทียบ
            </button>

            {result && <div className="text-xl font-semibold mt-4 text-blue-600">{result}</div>}
        </div>
    );
}