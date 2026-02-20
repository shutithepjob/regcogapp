'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { InsertCustomers } from '@/app/main/data';
import { GetCustomers } from '@/app/main/data';

export async function handleInsertCustomers(formData: FormData) {
    let success: boolean = false;
    try {
        // console.log("test");
        const rawData = {
            invoice_name: formData.get("invoice_name") as string,
            invoice_email: formData.get("invoice_email") as string,
            invoice_image: "",
        };
        await InsertCustomers(rawData);
        success = true;
    } catch (err) {
        let strErr = "Error handleInsertCustomers => " + err;
        console.error(strErr)
        throw new Error(strErr);
    }

    if (success) {
        revalidatePath("/main");
        redirect("/main");
    }

}

export async function handleGetCustomers() {
    try {
        // console.log("เข้าฟังก์ชัน handleGetCustomers");
        const invoices_row = await GetCustomers();
        return invoices_row;
    } catch (err) {
        let strErr = "Error handleGetCustomers => " + err;
        console.error(strErr)
        throw new Error(strErr);
    }
}