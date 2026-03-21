import Image from "next/image";
import Link from "next/link";
import { query } from '@/lib/db';

export default async function Page() {

  async function CreateTable() {
    try {
      let sql = "CREATE TABLE IF NOT EXISTS PersonData " +
        "(" +
        " person_fname VARCHAR(500) NOT NULL DEFAULT '', " +
        " person_lname VARCHAR(500) NOT NULL DEFAULT '', " +
        " person_age VARCHAR(100) NOT NULL DEFAULT '', " +
        " person_picture VARCHAR(300) NOT NULL DEFAULT '', " +
        " created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP " +
        ") ";

      const result = await query(sql);

      let sqlAddColumn = `ALTER TABLE PersonData ADD COLUMN 
      IF NOT EXISTS person_id VARCHAR(50) NOT NULL DEFAULT '' `;
      await query(sqlAddColumn);

      return true;
    } catch (err) {
      console.log("Error CreateTable : " + err);
      return false;
    }
  }

  await CreateTable();

  return (
    <div>
      <main className="flex flex-col items-center justify-center h-screen gap-10">
        <div>
          <Image
            src="/cat_trumbs_up.jpg"
            alt="cat"
            width={250}
            height={200}
          />
        </div>
        <h1 className="font-bold text-7xl">All Projects</h1>
      </main>
    </div>
  );
}