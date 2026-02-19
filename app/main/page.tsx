'use client'

import Table from '@/app/main/table';
import Link from 'next/link';
import React from 'react';

import { useState, useEffect } from 'react';

import { getInvoices } from '@/app/main/data';

interface  Invoice{
    customer_id: string,
    amount: number
}

export function Page_Add() {
    return (
        <div>
            <h1>หน้าเพิ่ม</h1>
        </div>
    );
}

export function Page() {

    const [invoices_row, setInvoices_row] = useState<Invoice[]>([]);

    useEffect(() => {
        const getDataFunc = async () => {
            const invoices_row = await getInvoices();
            setInvoices_row(invoices_row);
        };

        getDataFunc();
    }, []);

    let data = invoices_row;
    console.log(data);

    return (
        <div className="flex m-2 items-center justify-center flex-col bg-white">
            <h1>หน้าแรก</h1>
            <br />
            <h1 className="text-center p-2">
                <b className="text-xl">รายการ Invoices</b>
            </h1>
            {   
                invoices_row.map((invoice:any) => (
                    <div key={invoice.id}>
                        <p><b className="text-red-600">CustomerID</b> : {invoice.customer_id}</p>
                        <p><b className="text-purple-500">Customer Amount</b> : {invoice.amount}</p>
                    </div>
                ))
            }
        </div>
    );
}

export default function Main() {
    const [status, setStatus] = useState<string>("");
    const showClick = () => {
        setStatus("show");
    };
    const addClick = () => {
        setStatus("add");
    };

    const renderContent = () => {
        if (status == "show") {
            return <Page />
        }
        else if (status == "add") {
            return <Page_Add />
        }
    };
    return (
        <div className="flex m-2 items-center justify-center flex-col bg-white">
            <button onClick={showClick}>แสดงข้อมูล</button>
            <button onClick={addClick}>แสดงหน้าเพิ่ม</button>
            {renderContent()}
        </div>
    );
}

// export default function Page() {

//     const [invoices_row, setInvoices_row] = useState<Invoice[]>([]);

//     useEffect(() => {
//         const getDataFunc = async () => {
//             const invoices_row = await getInvoices();
//             setInvoices_row(invoices_row);
//         };

//         getDataFunc();
//     }, []);

//     let data = invoices_row;
//     console.log(data);

//     return (
//         <div className="flex m-2 items-center justify-center flex-col bg-white">
//             <h1>หน้าแรก</h1>
//             <br />
//             <h1 className="text-center p-2">
//                 <b className="text-xl">รายการ Invoices</b>
//             </h1>
//             {   
//                 invoices_row.map((invoice:any) => (
//                     <div key={invoice.id}>
//                         <p><b className="text-red-600">CustomerID</b> : {invoice.customer_id}</p>
//                         <p><b className="text-purple-500">Customer Amount</b> : {invoice.amount}</p>
//                     </div>
//                 ))
//             }
//         </div>
//     );
// }