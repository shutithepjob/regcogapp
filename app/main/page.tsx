import Link from 'next/link';
import Image from 'next/image';
import { auth } from "@/auth";
import LogoutButton from '../logoutButton';
import { ShowPersonData, GetPersonDataWithSearch } from './action';
//import DeletePersonData from '@/app/DeleteAllPersonData';
import SearchPerson from './searchPerson';

export default async function Page(props: { searchParams: Promise<{ query?: string }> }) {
  const session = await auth();
  const searchParams = await props.searchParams;
  const searchTerm = searchParams?.query || '';
  const dataPerson = await GetPersonDataWithSearch(searchTerm);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="px-6 py-5 flex flex-col justify-center items-center gap-5">
          <div>
            <p className="font-bold text-red-500">*ตัวระบบถูกพัฒนาไว้ใช้ทดสอบ และ รูปภาพที่เกี่ยวข้องล้วนเป็นภาพที่ใช้เพื่อทดสอบทั้งสิ้น</p>
          </div>
          <div className="flex gap-5">
            <div className="flex flex-col">
              <h1 className="font-bold text-3xl text-gray-900 ">Missing Person System</h1>
              <p className="text-gray-600 text-sm">ระบบค้นหาและจัดการข้อมูลคนหาย</p>
            </div>
            <div className="flex justify-center items-center">
              {
                session?.user?.email &&
                <div className="flex flex-col gap-1 justify-center items-center">
                  <span className="text-gray-700 font-medium">ชื่อผู้ล็อกอิน</span>
                  <span className="text-gray-700 font-medium">{session.user.email}</span>
                </div>
              }
            </div>
            <div className="flex justify-center items-center">
              {
                session?.user?.email && (
                  <div className="flex gap-3">
                    <Link
                      href="/addPerson"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      เพิ่มข้อมูล
                    </Link>
                    <LogoutButton />
                  </div>
                )
              }
            </div>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Search Section */}
        <div className="mb-10 bg-white rounded-xl shadow-md p-8 border border-gray-300">
          <h2 className="font-bold text-2xl text-gray-900 mb-6">ค้นหาข้อมูลคนหาย</h2>
          <SearchPerson />
        </div>

        {/* Results Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-2xl text-gray-900">รายการคนหาย</h3>
              <p className="text-gray-600 text-sm mt-1">ทั้งหมด {dataPerson?.length || 0} รายการ</p>
            </div>
          </div>

          {dataPerson && dataPerson.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {dataPerson.map((data) => (
                <div
                  key={data.person_id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative w-full h-60 bg-gray-300">
                    <Image
                      src={`/uploads/${data.person_picture}`}
                      alt={data.person_fname}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 font-bold text-sm">
                      ค้นหา
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* ID and Status */}
                    <div className="mb-4 flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-600 font-semibold uppercase">ID</p>
                        <p className="text-lg font-bold text-gray-800">{data.person_id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 font-semibold uppercase">สถานะ</p>
                        <p className="text-sm font-bold text-red-600">ยังค้นหา</p>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="mb-4 border-b border-gray-200 pb-4">
                      <p className="text-xs text-gray-600 font-semibold uppercase mb-1">ชื่อ-นามสกุล</p>
                      <h4 className="font-bold text-xl text-gray-900">
                        {data.person_fname} {data.person_lname}
                      </h4>
                    </div>

                    {/* Age */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-600 font-semibold uppercase mb-1">อายุ</p>
                      <p className="text-lg font-semibold text-gray-800">{data.person_age} ปี</p>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/main/detail/${data.person_id}`}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm "
                    >
                      ดูข้อมูลเพิ่มเติม
                    </Link>

                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-200">
              <p className="text-4xl mb-4">📋</p>
              <p className="text-xl font-bold text-gray-800 mb-2">ไม่พบข้อมูล</p>
              <p className="text-gray-600">
                {searchTerm
                  ? `ไม่พบผลลัพธ์สำหรับ "${searchTerm}"`
                  : 'ไม่มีรายการค้นหา'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}