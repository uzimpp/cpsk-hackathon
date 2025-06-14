import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">KU Connect</h3>
            <p className="text-sm">
              ระบบเชื่อมต่อชุมชนมหาวิทยาลัยเกษตรศาสตร์
              เพื่อให้นักศึกษาและบุคลากรสามารถติดต่อสื่อสารและแบ่งปันข้อมูลได้อย่างมีประสิทธิภาพ
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">เมนูหลัก</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  หน้าหลัก
                </Link>
              </li>
              <li>
                <Link
                  href="/forum"
                  className="hover:text-white transition-colors"
                >
                  กระดานสนทนา
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  กิจกรรม
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="hover:text-white transition-colors"
                >
                  โปรไฟล์
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">ทรัพยากร</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="hover:text-white transition-colors"
                >
                  ศูนย์ช่วยเหลือ
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-semibold">ติดต่อเรา</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>contact@kuconnect.ac.th</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>02-XXX-XXXX</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>มหาวิทยาลัยเกษตรศาสตร์ บางเขน</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} KU Connect. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/terms"
                className="text-sm hover:text-white transition-colors"
              >
                เงื่อนไขการใช้งาน
              </Link>
              <Link
                href="/privacy"
                className="text-sm hover:text-white transition-colors"
              >
                นโยบายความเป็นส่วนตัว
              </Link>
              <Link
                href="/cookies"
                className="text-sm hover:text-white transition-colors"
              >
                นโยบายคุกกี้
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
