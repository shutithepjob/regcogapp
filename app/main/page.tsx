import Link from 'next/link';
import Image from 'next/image';
import { auth } from "@/auth";
import LogoutButton from '../logoutButton';
import { ShowPersonData,GetPersonDataWithSearch } from './action';
import DeletePersonData from '@/app/DeleteAllPersonData';
import SearchPerson from './searchPerson';

export default async function Page(props: {searchParams: Promise<{query?: string}>}) {
  //const { data: session, status } = useSession(); //ของฝั่ง Client
  const session = await auth();

  const searchParams = await props.searchParams;
  const searchTerm = searchParams?.query || '';
  const dataPerson = await GetPersonDataWithSearch(searchTerm);

  return (
    <div className="flex flex-col justify-center items-center m-10 gap-5">
      <div className="flex flex-row justify-center items-center gap-2">
        ชื่อผู้ใช้ :
        {
          session?.user?.email
            ?
            <>
              {session?.user?.email}
              {<LogoutButton />}
            </>
            :
            'ผู้ไม่ระบุตัวตน'
        }
      </div>
      <h1 className="font-bold text-3xl">จัดการรายการคนหาย</h1>
      <div className="flex flex-row gap-2">
        {
          session?.user?.email && <DeletePersonData />
        }
        {
          !session && (
            <Link
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              เข้าสู่ระบบ
            </Link>
          )
        }
      </div>

      <SearchPerson />

      <h1 className="font-bold text-3xl">แสดงรายการคนหาย</h1>
      <div className="grid grid-cols-3 gap-10">
        {
          dataPerson
            ?
            dataPerson.map((data) => (
              <div key={data.person_id} className="flex flex-col gap-3">
                <Image
                  src={`/uploads/${data.person_picture}`}
                  alt={data.person_fname}
                  width={200}
                  height={200}
                />
                <p>รหัส : {data.person_id}</p>
                <p>ชื่อ : {data.person_fname}  {data.person_lname}</p>
                <p>อายุ : {data.person_age}</p>
              </div>
            ))
            :
            <div>
              <p className="text-red-600 font-bold m-10">ไม่มีข้อมูลให้แสดง</p>
            </div>
        }
      </div>

    </div>
  );
}