import Link from 'next/link';
import ShowPersonsPage from './showPersons';
import { auth } from "@/auth";
import LogoutButton from '../logoutButton';

export default async function Page() {
  //const { data: session, status } = useSession(); //ของฝั่ง Client
  const session = await auth();

  return (
    <div className="flex flex-col justify-center items-center m-10">
      <h1 className="font-bold text-4xl">แสดงรายการคนหาย</h1>

      <br />

      <ShowPersonsPage />

      <br />

      <Link
        href="/main/facedetect"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        กดไปหน้า face detect
      </Link>

      <br />

      <p>ชื่อผู้ใช้ : {session?.user?.email ? session?.user?.email : 'ผู้ไม่ระบุตัวตน'}</p>

      {
        session && (
          <LogoutButton / >
        )
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
  );
}