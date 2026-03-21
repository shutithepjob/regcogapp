import { query } from '@/lib/db';

export async function Delete_PersonData() {
    try {
        const sql = `DELETE FROM PersonData `;
        await query(sql);
    } catch (err) {
        const errStr = "Error Delete_PersonData => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }
}

export async function Get_PersonData() {
    try {
        const sql = `SELECT * FROM PersonData `;
        const result = await query(sql);
        return result.rows;
    } catch (err) {
        const errStr = "Error Insert_PersonData => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }
}

//data: { person_fname: string, person_lname: string, person_age: string, person_picture: File }
export async function Insert_PersonData(data: any) {
    try {
        // const data = Object.fromEntries(formData);
        console.log("Data : " + data);
        const { person_id, person_fname, person_lname, person_age, person_picture } = data;

        const sql = `INSERT INTO PersonData 
        (
            person_id, person_fname, person_lname, person_age, person_picture
        ) 
        VALUES 
        (
            $1, $2, $3, $4, $5
        ) `;
        await query(sql, [
            person_id,
            person_fname,
            person_lname,
            person_age,
            person_picture,
        ]);

        return {
            success: true,
        }
    } catch (err) {
        const errStr = "Error Insert_PersonData => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }
}