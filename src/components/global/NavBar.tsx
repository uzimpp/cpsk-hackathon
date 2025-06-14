"use client";

import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-light-green"
            >
              KU Connect
            </Link>
          </div>

          <div className="hidden sm:flex sm:space-x-8">
            <Link
              href="/ask-ai"
              className="text-white hover:text-light-green px-3 py-2 rounded-md text-sm font-medium"
            >
              ถาม-ตอบ
            </Link>
            <Link
              href="/forum"
              className="text-white hover:text-light-green px-3 py-2 rounded-md text-sm font-medium"
            >
              กระทู้
            </Link>
            <Link
              href="/timeline"
              className="text-white hover:text-light-green px-3 py-2 rounded-md text-sm font-medium"
            >
              ปฏิทิน
            </Link>
            <Link
              href="/news"
              className="text-white hover:text-light-green px-3 py-2 rounded-md text-sm font-medium"
            >
              ข่าวสาร
            </Link>
          </div>

          <div className="flex items-center">
            <button className="bg-light-green text-dark px-4 py-2 rounded-md text-sm font-medium hover:opacity-80">
              <Link href="/signin">เข้าสู่ระบบ</Link>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
