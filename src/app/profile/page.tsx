"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ProfileData {
  name: string;
  email: string;
  studentId?: string;
  faculty?: string;
  major?: string;
  year?: string;
  bio?: string;
  avatar?: string;
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    studentId: "",
    faculty: "",
    major: "",
    year: "",
    bio: "",
    avatar: "/default-avatar.png",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      // TODO: Fetch user profile data from your backend
      setProfile({
        name: session.user.name || "",
        email: session.user.email || "",
        // Add other profile data here
      });
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-light-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          {/* Profile Header */}
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative h-20 w-20 rounded-full overflow-hidden">
                  <Image
                    src={profile.avatar || "/default-avatar.png"}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {profile.name}
                  </h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-light-green hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-green"
              >
                {isEditing ? "ยกเลิก" : "แก้ไขโปรไฟล์"}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-4 py-5 sm:p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ชื่อ-นามสกุล
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-green focus:border-light-green sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="studentId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      รหัสนักศึกษา
                    </label>
                    <input
                      type="text"
                      id="studentId"
                      value={profile.studentId}
                      onChange={(e) =>
                        setProfile({ ...profile, studentId: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-green focus:border-light-green sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="faculty"
                      className="block text-sm font-medium text-gray-700"
                    >
                      คณะ
                    </label>
                    <input
                      type="text"
                      id="faculty"
                      value={profile.faculty}
                      onChange={(e) =>
                        setProfile({ ...profile, faculty: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-green focus:border-light-green sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="major"
                      className="block text-sm font-medium text-gray-700"
                    >
                      สาขา
                    </label>
                    <input
                      type="text"
                      id="major"
                      value={profile.major}
                      onChange={(e) =>
                        setProfile({ ...profile, major: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-green focus:border-light-green sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="year"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ชั้นปี
                    </label>
                    <input
                      type="text"
                      id="year"
                      value={profile.year}
                      onChange={(e) =>
                        setProfile({ ...profile, year: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-green focus:border-light-green sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="bio"
                    className="block text-sm font-medium text-gray-700"
                  >
                    เกี่ยวกับฉัน
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-light-green focus:border-light-green sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-green"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-light-green hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-green"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      รหัสนักศึกษา
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.studentId || "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">คณะ</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.faculty || "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">สาขา</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.major || "-"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      ชั้นปี
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.year || "-"}
                    </p>
                  </div>
                </div>
                {profile.bio && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      เกี่ยวกับฉัน
                    </h4>
                    <p className="mt-1 text-sm text-gray-900">{profile.bio}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
