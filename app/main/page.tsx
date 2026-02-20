'use client'

import { useState, useEffect } from 'react';

import { Spinner } from '@/app/spinner';
import { handleInsertCustomers } from '@/app/main/action'
import { handleGetCustomers } from '@/app/main/action';

interface Invoice {
    customer_id: string,
    amount: number
}

export function Page_Add({ showClick }: { showClick: () => void }) {
    return (
        <div>
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
                onClick={showClick}
            >
                ย้อนกลับ
            </button>

            <br />
            <h2>กรอกข้อมูล Invoices</h2>
            <br />
            <form
                action={handleInsertCustomers}
                className="space-y-4"
            >
                <div>
                    <label
                        className="block text-sm font-medium -text-gray-700"
                    >
                        ชื่อInvoices
                    </label>
                    <input
                        name="invoice_name"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ชื่อInvoices"
                        required
                    />
                </div>
                <div>
                    <label
                        className="block text-sm font-medium -text-gray-700"
                    >
                        Email</label>
                    <input
                        name="invoice_email"
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 p-2 outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="email"
                        required
                    />
                </div>

                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors font-medium">
                    บันทึกข้อมูล
                </button>
            </form>
        </div>
    );
}

export function Page({ addClick }: { addClick: () => void }) {

    const [invoices_row, setInvoices_row] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const getDataFunc = async () => {
            const invoices_row = await handleGetCustomers();
            setInvoices_row(invoices_row);
            setIsLoading(false);
        };

        getDataFunc();
    }, []);

    let data = invoices_row;
    // console.log(data);

    return (
        <div className="flex m-2 items-center justify-center flex-col bg-white">
            <h1>หน้าแรก</h1>
            <br />
            <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors active:scale-95"
                onClick={addClick}
            >
                เพิ่มข้อมูล
            </button>
            <h1 className="text-center p-2">
                <b className="text-xl">รายการ Customers</b>
            </h1>
            {
                isLoading ?
                    <Spinner />
                    :
                    invoices_row.map((invoice: any) => (
                        <div key={invoice.id}>
                            <p><b className="text-green-600">CustomerPathImage</b> : {invoice.image_url}</p>
                            <p><b className="text-red-600">CustomerID</b> : {invoice.name}</p>
                            <p><b className="text-purple-500">Customer Amount</b> : {invoice.email}</p>
                        </div>
                    ))
            }
        </div>
    );
}

export default function Main() {

    const [status, setStatus] = useState<string>("show");

    const showClick = () => {
        setStatus("show");
    };
    const addClick = () => {
        setStatus("add");
    };

    const renderContent = () => {
        if (status == "show") {
            return <Page addClick={addClick} />
        }
        else if (status == "add") {
            return <Page_Add showClick={showClick} />
        }
    };

    return (
        <div className="flex m-2 items-center justify-center flex-col bg-white">
            {renderContent()}
        </div>
    );
}