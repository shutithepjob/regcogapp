'use client'

import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const isConfirm = confirm("ยืนยันล็อกอิน");
        if (!isConfirm) {
            return false
        }

        setIsLoading(true);

        const formData = new FormData(e.currentTarget);

        const result = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
        });

        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();


        if (session?.user) {
            const role = session.user.role;
            router.push("/main");
            router.refresh();
        } else {
            // Fallback
            router.push("/login/error");
        }
    };
    return (
        <div className="flex justify-center p-20">
            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 border p-10 rounded shadow-lg"
            >
                <h2 className="text-xl font-bold text-center">Login</h2>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="border p-2"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="border p-2"
                    required
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 flex justify-center items-center gap-2"
                >
                    {isLoading && (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    )}
                    {isLoading ? 'กำลังเข้าสู่ระบบ' : 'เข้าสู่ระบบ'}
                </button>
            </form>
        </div>
    );
}