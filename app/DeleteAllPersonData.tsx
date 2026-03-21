'use client'

import { DelPersonData } from '@/app/main/action';

export default function DeletePersonData() {
    
    const HandleDelClick = async () => {
        const isConfirm = confirm("ยืนยันลบข้อมูล");
        if (isConfirm) {
            await DelPersonData();
        }
    };

    return (
        <div>
            <button 
                onClick={HandleDelClick}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
            >
                ลบข้อมูลคนหาย
            </button>
        </div>
    );
}