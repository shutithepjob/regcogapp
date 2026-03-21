'use server'
import { join } from 'path';
import { writeFile, mkdir, access } from 'fs/promises';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Insert_PersonData, Get_PersonData } from './data';
import { existsSync } from 'fs';

export async function HandleAddPerson(formData: FormData) {
    try {
        const person_id = formData.get("person_id") as string;
        const person_fname = formData.get("person_fname") as string;
        const person_lname = formData.get("person_lname") as string;
        const person_age = formData.get("person_age") as string;
        const person_picture = formData.get("person_picture") as File;

        if (person_picture && person_picture.size > 0) {

            const uploadPath = join(process.cwd(), 'public/uploads');
            if (!existsSync(uploadPath)) {
                await mkdir(uploadPath, { recursive: true });
                console.log("create folder");
            }

            const bytes = await person_picture.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = person_picture.name;

            const path = join(process.cwd(), 'public/uploads', fileName);

            await writeFile(path, buffer);
            console.log(`อัพโหลดรูปสำเร็จที่ : /uploads/${fileName}`);

            const data = {
                person_id: person_id as string,
                person_fname: person_fname as string,
                person_lname: person_lname as string,
                person_age: person_age as string,
                person_picture: fileName as string,
            };

            await Insert_PersonData(data);

        } else {
            console.log("อัพโหลดรูปภาพก่อนกดบันทึก");
        }

    } catch (err) {
        const errStr = "Error ShowPersonData => ";
        console.error(errStr + err);
        throw new Error(errStr + err);
    }

    revalidatePath('/main');
    redirect('/main');

}