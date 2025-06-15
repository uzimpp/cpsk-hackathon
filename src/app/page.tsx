"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#22c55e]/10 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              ยินดีต้อนรับสู่ <span className="text-[#22c55e]">KUConnect</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              แพลตฟอร์มสำหรับนักศึกษามหาวิทยาลัยเกษตรศาสตร์ เชื่อมต่อ พูดคุย
              และแบ่งปันประสบการณ์ร่วมกัน
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/forum">
                <Button className="!px-8 !py-3 !text-lg">
                  <span className="flex flex-row gap-2 items-center justify-center">
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                    เริ่มต้นใช้งาน
                  </span>
                </Button>
              </Link>
              <Link href="/ask-ai">
                <Button className="!px-8 !py-3 !text-lg !bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100">
                  ถาม AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            คุณสมบัติเด่น
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#22c55e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ฟอรั่มพูดคุย
              </h3>
              <p className="text-gray-600">
                แบ่งปันความคิดเห็น ถามคำถาม
                และแลกเปลี่ยนประสบการณ์กับเพื่อนนักศึกษา
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#22c55e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                ถาม AI
              </h3>
              <p className="text-gray-600">
                รับคำแนะนำและคำตอบจาก AI ที่เข้าใจบริบทของนักศึกษาเกษตรศาสตร์
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[#22c55e]/10 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#22c55e]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                เชื่อมต่อชุมชน
              </h3>
              <p className="text-gray-600">
                สร้างเครือข่ายและเชื่อมต่อกับเพื่อนนักศึกษาจากทุกคณะ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="bg-[#22c55e]/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            พร้อมที่จะเริ่มต้นแล้วหรือยัง?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            เข้าร่วมชุมชน KUConnect วันนี้
            และเริ่มต้นการเดินทางแห่งการเรียนรู้ร่วมกัน
          </p>
          <Link href="/forum">
            <Button className="!px-8 !py-3 !text-lg">
              <span className="flex flex-row gap-2 items-center justify-center">
                <ArrowRightIcon className="h-5 w-5 ml-2" />
                เริ่มต้นใช้งาน
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
