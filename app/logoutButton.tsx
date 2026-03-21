'use client'

import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButton() {

    const {data: session, status} = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const signOutProcess = async () => {
        const isConfirm = confirm("ยืนยันล็อกเอาท์");
        if (!isConfirm) {
            return false;
        }
        
        setIsLoading(true);

        await signOut({
            callbackUrl: "/login"
        });
    };

    return (
        <div className="flex flex-col gap-2 justify-center items-center ">
            <button
                onClick={signOutProcess}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 trranstion-colors flex justify-center items-center gap-2"
            >
                {
                    isLoading && 
                    <div className=" h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent "></div>
                }
                {
                    isLoading ? 'กำลังออกจากระบบ' : 'ออกจากระบบ'
                }
                
            </button>
        </div>
    );
}