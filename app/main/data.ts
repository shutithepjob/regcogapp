'use server'

import { query } from '@/lib/db'

export async function getInvoices() {
    const result = await query(`SELECT * FROM Invoices `);
    const invoices_row = result.rows;
    return invoices_row;
}

export async function InsertInvoices(){

}