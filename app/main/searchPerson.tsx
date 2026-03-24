'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
//import { UploadPicture } from './action';
import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { ShowPersonData } from './action';
import Image from 'next/image';

export default function SearchPerson() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [image, setImage] = useState<string | null>(null);
    const [image2, setImage2] = useState<string | null>(null);
    const [result, setResult] = useState<string>("รูปที่กำลังจะแสดงตอนค้นหา");
    const [user_image, setUser_Image] = useState<string>(`/next.svg`);
    const [result_image, setResult_image] = useState<string>('/cat_trumbs_up.jpg');

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
                //setModelsIsLoaded(true);
            } catch (error) {
                console.log("Error ModelLoad : " + error);
            }
        };
        loadModels();
    }, []);

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    function handleChange(e: React.ChangeEvent<HTMLInputElement>, setImage: Function) {
        if (e.target.files && e.target.files[0]) {
            setImage(URL.createObjectURL(e.target.files[0]));
            setUser_Image(URL.createObjectURL(e.target.files[0]));
        }
    }

    async function handleClickUpload() {

        const chk: string = await compareFaces();
        if (chk == "NoImage") {
            alert("อัพโหลดรูปก่อน");
        }
        else if (chk == "NotFound") {
            setResult_image(`/CryingCat.jpg`);
            setResult("ขออภัยรูปภาพที่อัพโหลดตรวจหาไม่เจอ กรุณาลองอัพโหลดรูปใหม่");
        }
    }

    const compareFaces = async (): Promise<string> => {
        if (!image) {
            return "NoImage";
        }

        setResult_image(`/next.svg`);
        setResult("กำลังประมวลผล...");

        const option = new faceapi.TinyFaceDetectorOptions(
            {
                inputSize: 512,
                scoreThreshold: 0.1
            }
        );

        const img1 = await faceapi.fetchImage(image);
        const desc1 = await faceapi.detectSingleFace(img1, option)
            .withFaceLandmarks().withFaceDescriptor();

        const dataPerson: any[] = (await ShowPersonData()) || [];

        let chkFound = false;
        for (const data of dataPerson) {
            try {
                const img2 = await faceapi.fetchImage(`/uploads/${data.person_picture}`);
                const desc2 = await faceapi.detectSingleFace(img2, option)
                    .withFaceLandmarks().withFaceDescriptor();

                const distance = desc1 && desc2 ? faceapi.euclideanDistance(desc1.descriptor, desc2.descriptor) : 1.0;
                //console.log("distance : " + distance);
                if (distance < 0.3) {
                    setResult_image(`/uploads/${data.person_picture}`);
                    setResult(`เป็นคนเดียวกัน (ค่าความต่าง: ${distance.toFixed(4)}) `);
                    chkFound = true;
                    break;
                } else {
                    setResult_image(`/uploads/${data.person_picture}`);
                    setResult(`คนละคนกัน (ค่าความต่าง: ${distance.toFixed(4)})`);
                }
            } catch (err) {
                alert("Error process Detection" + err);
                console.log("Error process Detection : " + err);
            }
        }

        if (chkFound) {
            return "Found";
        } else {
            return "NotFound";
        }
    };

    return (

        <div className="flex flex-col w-full gap-4 justify-center items-center">
            <div className="flex flex-row w-full gap-4 justify-center items-center">
                <label htmlFor="searchInput" >กรอกค้นหาชื่อ</label>
                <input
                    type="text"
                    id="searchInput"
                    className="w-sm p-2 rounded-lg shadow-sm border focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={(e) => { handleSearch(e.target.value) }}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>

            <div className="flex flex-row w-full gap-4 justify-center items-center">
                <label htmlFor="search_image" >ค้นหาจากไฟล์รูป</label>
                <input
                    type="file"
                    id="search_image"
                    name="search_image"
                    className="w-sm p-2 rounded-lg shadow-sm border focus:ring-2 focus:ring-blue-500 outline-none file:text-blue-500"
                    accept="image/*"
                    onChange={(e) => { handleChange(e, setImage) }}
                />
                <button
                    onClick={handleClickUpload}
                    className="bg-yellow-500 hover:bg-yellow-600 rounded text-white p-2"
                >
                    Upload
                </button>
            </div>
            <br />
            <h1 className="font-bold text-3xl">ค้นหาคนหายด้วยรูปภาพ</h1>
            <div className="flex flex-row gap-5 justify-center items-center">
                <div className="flex flex-col gap-4 justify-center items-center ">
                    <span>รูปที่คุณอัพโหลด</span>
                    <Image
                        src={user_image}
                        alt="user_upload"
                        width={200}
                        height={200}
                    />
                </div>
                {
                    result_image &&
                    <div className="flex flex-col gap-4 justify-center items-center ">
                        <span>{result}</span>
                        <Image
                            src={result_image}
                            alt="system_upload"
                            width={200}
                            height={200}
                        />
                        
                    </div>
                }

            </div>

        </div>


    );
}