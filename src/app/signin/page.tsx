"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Replace this with actual login logic (e.g., call to API or next-auth)
      console.log("Sign in:", { email, password });

      // Simulate delay (remove in prod)
      await new Promise((r) => setTimeout(r, 1000));

      // Simulate login error
      // throw new Error("Invalid credentials");
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-stone-200 rounded-2xl shadow-md transition-all">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">ยินดีต้อนรับกลับ</h1>
          <p className="mt-2 text-sm text-gray-600">
            ยังไม่มีบัญชี?{" "}
            <Link
              href="/signup"
              className="font-medium text-light-green hover:text-green-600 transition-colors"
            >
              สมัครสมาชิก
            </Link>
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                อีเมล
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent transition-colors"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                รหัสผ่าน
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-light-green focus:ring-light-green border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">จดจำฉัน</span>
            </label>

            <Link
              href="/forgot-password"
              className="text-light-green hover:text-green-600"
            >
              ลืมรหัสผ่าน?
            </Link>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-light-green text-white rounded-lg font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-green transition-all"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>
      </div>
    </div>
  );
}
