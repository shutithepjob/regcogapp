import { query } from '@/lib/db';
import { HandleAddPerson } from './action';

export default async function FormUpload() {

    return (
        <div className="flex justify-center m-7">
            <form action={HandleAddPerson}
                className="flex flex-col gap-4"
            >
                <h1 className="flex font-bold justify-center text-3xl">เพิ่มข้อมูลคนหาย</h1>
                <label htmlFor="person_fname">รหัส : </label>
                <input
                    id="person_id"
                    name="person_id"
                    placeholder="รหัส(ใส่ได้ไม่เกิน 50 ตัว)"
                    className="border p-2 rounded"
                    maxLength={50}
                    required
                />
                <label htmlFor="person_fname">ชื่อ : </label>
                <input
                    id="person_fname"
                    name="person_fname"
                    placeholder="ชื่อ(ใส่ได้ไม่เกิน 100 ตัว)"
                    className="border p-2 rounded"
                    maxLength={100}
                    required
                />
                <label htmlFor="person_lname">นามสกุล : </label>
                <input
                    id="person_lname"
                    name="person_lname"
                    placeholder="นามสกุล(ใส่ได้ไม่เกิน 100 ตัว)"
                    className="border p-2 rounded"
                    maxLength={100}
                    required
                />
                <label htmlFor="person_lname">อายุ : </label>
                <input
                    id="person_age"
                    name="person_age"
                    placeholder="อายุ(ใส่ได้ไม่เกิน 3 ตัว)"
                    className="border p-2 rounded"
                    maxLength={3}
                    required
                />
                <label htmlFor="persor_picture">อัพโหลดรูปภาพ : </label>
                <input
                    type="file"
                    id="person_picture"
                    name="person_picture"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white p-2 rounded"
                >
                    บันทึก
                </button>

            </form>
        </div>
    );
}