import Link from "next/link";
import Image from "next/image";
import { GetPersonDataWithID } from "./action";

type Props = {
    params: Promise<{
        id: string;
    }>
}

export default async function Detail({ params }: Props) {
    const { id } = await params;
    const dataPerson = await GetPersonDataWithID(id);
    //console.log(dataPerson);
    const data = dataPerson?.[0];
    //console.log(data);
    return (
        <div className="flex flex-col justify-center items-center gap-4 m-5 ">
            <Link
                href="/main"
                className="bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm px-2 py-2 transition-colors"
            >
                ย้อนกลับ
            </Link>
            {
                <div key={data.person_id} className="flex flex-col gap-3">
                    <h1 className="flex justify-center font-bold text-2xl">แสดงรายละเอียด</h1>
                    <Image
                        src={`/uploads/${data.person_picture}`}
                        alt="personPicture"
                        width={200}
                        height={200}
                    />
                    <p>รหัส : {data.person_id}</p>
                    <p>ชื่อ : {data.person_fname} {data.person_lname}</p>
                    <p>อายุ : {data.person_age}</p>
                </div>
            }
            {/* {
                dataPerson?.map((data) => (
                    <div key={data.person_id}>
                        <h1>แสดงรายละเอียด</h1>
                        <p>รหัส : {data.person_id}</p>
                        <p>ชื่อ : {data.person_fname} {data.person_lname}</p>
                        <p>อายุ : {data.person_age}</p>
                    </div>
                ))
            } */}
        </div>
    );
}