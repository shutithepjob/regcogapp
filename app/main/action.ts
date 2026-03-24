'use server'

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { InsertCustomers } from '@/app/main/data';
import { GetCustomers,GetPersonData_Search } from '@/app/main/data';
import { 
    Get_PersonData, 
    Delete_PersonData, 
} 
    from '@/app/addPerson/data';

export async function UploadPicture(formData: FormData) {
    let status: boolean = false;
    try {
        
    } catch (err) {
        const errStr = "Error UploadPicture => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }

    if (status) {
        return true;
    }
}

export async function GetPersonDataWithSearch(term: string) {
    let status: boolean = false;
    let rows: any[] = [];
    try {
        rows = await GetPersonData_Search(term);
        status = true;
    } catch (err) {
        const errStr = "Error GetPersonDataWithSearch => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }

    if (status) {
        //revalidatePath('/main');
        return rows;
    }
}

export async function DelPersonData() {
    let status: boolean = false;
    try {
        await Delete_PersonData();
        status = true;
    } catch (err) {
        const errStr = "Error DelPersonData => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }

    if (status) {
        revalidatePath('/main');
        redirect('/main');
    }
}

export async function ShowPersonData() {
    try {
        const rows = await Get_PersonData();
        if (rows.length > 0) {
            return rows;
        } else {
            return false;
        }
    } catch (err) {
        const errStr = "Error ShowPersonData => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }
}

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