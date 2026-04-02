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
    const [result, setResult] = useState<string>("รูปที่กำลังจะแสดงตอนค้นหา(เมื่อทำการกดUpload)");
    const [user_image, setUser_Image] = useState<string>('');
    const [result_image, setResult_image] = useState<string>('');
    const [isMatched, setIsMatched] = useState<boolean>(false);

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
        setResult_image('');
        setResult("รูปที่กำลังจะแสดงตอนค้นหา");
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
            setIsMatched(false);
            setResult_image('/file.svg');//ปรับให้ไม่ต้องแสดงรูปเพราะ ยังไม่มีรูปที่ควรให้แสดงถ้าเกิดค้นหาไม่พบ
            setResult("❌ ไม่พบข้อมูลคนที่ตรงกับรูปภาพ กรุณาลองอัพโหลดรูปใหม่");
        }
        else if (chk == "Found") {
            setIsMatched(true);
        }
    }

    const compareFaces = async (): Promise<string> => {
        if (!image) {
            return "NoImage";
        }

        //setResult_image(`/next.svg`);
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
                if (distance < 0.3) {
                    setResult_image(`/uploads/${data.person_picture}`);
                    setResult(`✅ เป็นคนเดียวกัน (ค่าความต่าง: ${distance.toFixed(4)}) `);
                    setIsMatched(true);
                    chkFound = true;
                    break;
                }
            } catch (err) {
                alert("Error process Detection" + err);
                console.log("Error process Detection : " + err);
            }
        }

        if (chkFound) {
            return "Found";
        } else {
            setIsMatched(false);
            return "NotFound";
        }
    };

    return (
        <div className="w-full space-y-6">
            {/* Search by Name */}
            <div className="space-y-3">
                <label htmlFor="searchInput" className="block font-bold text-gray-800">
                    🔍 ค้นหาชื่อ
                </label>
                <input
                    type="text"
                    id="searchInput"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition text-gray-800 placeholder-gray-500"
                    placeholder="พิมพ์ชื่อคนที่ต้องการค้นหา..."
                    onChange={(e) => { handleSearch(e.target.value) }}
                    defaultValue={searchParams.get('query')?.toString()}
                />
            </div>

            <div className="border-t-2 border-gray-300 pt-6">
                <h3 className="font-bold text-gray-800 mb-4">🖼️ ค้นหาด้วยรูปภาพ</h3>

                {/* File Upload Section */}
                <div className="space-y-3 mb-6">
                    <label htmlFor="search_image" className="block">
                        <div className="border-2 border-dashed border-blue-400 rounded-lg p-8 text-center hover:bg-blue-50 transition cursor-pointer">
                            <div className="text-4xl mb-2">📸</div>
                            <p className="font-semibold text-gray-800">คลิกเพื่อเลือกรูป</p>
                            <p className="text-sm text-gray-600">หรือลากรูปมาวางที่นี่</p>
                        </div>
                    </label>
                    <input
                        type="file"
                        id="search_image"
                        name="search_image"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => { handleChange(e, setImage) }}
                    />
                </div>

                {/* Image Preview and Results */}
                <div className="space-y-6">
                    {/* Images Grid - Top Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* User Uploaded Image */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="font-semibold text-gray-800 mb-3">รูปที่คุณอัพโหลด</p>
                            {!user_image ? (
                                <div className="h-64 flex items-center justify-center text-gray-500 text-center">
                                    <p>รูปภาพจะแสดงตรงนี้</p>
                                </div>
                            ) : (
                                <Image
                                    src={user_image}
                                    alt="user_upload"
                                    width={300}
                                    height={300}
                                    className="w-full rounded-lg object-cover"
                                />
                            )}
                        </div>

                        {/* Result Image */}
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <p className="font-semibold text-gray-800 mb-3">ภาพผลค้นหา</p>
                            {result_image && !isMatched ? (
                                <div className="h-64 flex flex-col justify-center items-center text-center">
                                    <p>{result}</p>
                                    {/* <Image
                                        src={result_image}
                                        alt="not_found"
                                        width={300}
                                        height={300}
                                        className="w-full rounded-lg object-cover"
                                    /> */}
                                </div>
                            ) : result_image && isMatched ? (
                                <Image
                                    src={result_image}
                                    alt="system_result"
                                    width={300}
                                    height={300}
                                    className="w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="h-64 flex items-center justify-center text-gray-500 text-center">
                                    <p>รูปผลค้นหาจะแสดงตรงนี้</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Results Header - Bottom Section */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="font-semibold text-gray-800 mb-3">ผลการค้นหา</p>
                        {result === "กำลังประมวลผล..." ? (
                            <div className="h-20 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="inline-block">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                        <p className="text-blue-600 font-bold text-lg">{result}</p>
                                    </div>
                                </div>
                            </div>
                        ) : result_image && !isMatched ? (
                            <div className="bg-red-100 border-2 border-red-500 p-4 rounded-lg text-center">
                                <p className="text-red-700 font-bold text-base">{result}</p>
                            </div>
                        ) : result_image && isMatched ? (
                            <div className="space-y-3">
                                <div className="bg-green-100 border-2 border-green-500 p-4 rounded-lg text-center">
                                    <p className="text-green-700 font-bold text-lg">✅ {result}</p>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            alert("ไปหน้ารายละเอียดเพิ่มเติม");
                                        }}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition"
                                    >
                                        ดูรายละเอียดเพิ่มเติม
                                    </button>
                                    <button
                                        onClick={() => {
                                            setResult_image('');
                                            setImage(null);
                                            setUser_Image('');
                                            setIsMatched(false);
                                            setResult("รูปที่กำลังจะแสดงตอนค้นหา(เมื่อทำการกดUpload)");
                                        }}
                                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition"
                                    >
                                        ค้นหาใหม่
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-20 flex items-center justify-center">
                                <p className="text-gray-500 text-center text-sm px-4">{result}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Upload Button */}
                {image && (
                    <button
                        onClick={handleClickUpload}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
                    >
                        🚀 ค้นหา
                    </button>
                )}
            </div>
        </div>
    );
}