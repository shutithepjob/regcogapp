'use client'

import { useState, useEffect } from 'react';

import { Spinner } from '@/app/spinner';
import { handleInsertCustomers } from '@/app/main/action'
import { handleGetCustomers } from '@/app/main/action';
import Link from 'next/link';



export default function Page() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fectData = async () => {
            try {
                setLoading(true);
                const data = await handleGetCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Error : "+error);
            } finally {
                setLoading(false);
            }
        };
        fectData();
    }, []);

    return (
        <div className="justify-center items-center">
            <h1>แสดงรายการ</h1>
            <Link href="/main/facedetect" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                กดไปหน้า face detect
            </Link>
            {
                loading && <div>กำลังโหลด</div>
            }
            {
                customers.map((customer: any) => (
                    <div key={customer.id}>
                        <p>{customer.name}</p>
                    </div>
                ))
            }
        </div>
    );
}

