import Link from "next/link";


export default function LoginFailedPage() {
    return (
        <div className="flex flex-col m-50 gap-4 ">
            <h1 className="w-full h-full text-center">ล็อกอินไม่ผ่าน กรุณาล็อกอินใหม่</h1>
            <Link
                href="/login"
                className="
                flex
                justify-center
                items-center
                bg-blue-600 
                text-white 
                rounded 
                px-2 
                py-2 
                hover:bg-blue-700 
                text-center 
                w-44
                self-center
                "
            >
                ล็อกอิน
            </Link>
        </div>
    );
}