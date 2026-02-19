'use client'

import { query } from '@/lib/db';
import { useState, useEffect } from 'react';

export default function Invoices() {
    const [invoices_row, setInvoices_row] = useState<any>();

    useEffect(() => {
        const fetchData = async () => {
            const result = await query('SELECT * FROM Invoices ');
            const invoices_row = result.rows;
            if (invoices_row) {
                setInvoices_row(invoices_row);
            }
            // console.log(invoices_row);
        };
    }, []);

    return (
        <div className="items-center justify-center m-10 bg-blue-200">
            <h1 className="text-center p-2">
                <b className="text-xl">รายการ Invoices</b>
            </h1>
            {invoices_row.map((invoice: any) => (
                <div key={invoice.id}>
                    <p><b className="text-red-600">CustomerID</b> : {invoice.customer_id}</p>
                    <p><b className="text-purple-500">Customer Amount</b> : {invoice.amount}</p>
                </div>
            ))}
        </div>
    );
}