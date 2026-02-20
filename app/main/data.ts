import { query } from '@/lib/db'

export async function GetCustomers() {
    try {
        const result = await query(`SELECT * FROM Customers `);
        const invoices_row = result.rows;
        return invoices_row;
    } catch (err) {
        console.error("DB ERROR getInvoices => ", err);
        throw new Error("DB ERROR getInvoices : "+ err);
    }
}

export async function InsertCustomers(data: {invoice_name:string, invoice_email: string, invoice_image: string}) {
    try {
        const sql = `INSERT INTO customers(name, email, image_url) VALUES($1, $2, $3)`;
        await query(sql, [data.invoice_name, data.invoice_email, data.invoice_image]);
        console.log("บันทึกข้อมูลสำเร็จ");
        return { success: true }
    } catch (err) {
        console.error("Error InsertInvoices => ", err);
        throw new Error("Error InsertInvoices => "+err);
    }
}