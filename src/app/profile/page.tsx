"use client";

export default function Profile() {
  // Mock user data
  const userData = {
    studentId: "6710545865",
    name: "วรกฤต กุลณัฐโภคิน",
    faculty: "วิศวกรรมศาสตร์",
    major: "วิศวกรรมซอฟต์แวร์และความรู้",
    year: "2",
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">โปรไฟล์</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสนักศึกษา
              </label>
              <p className="mt-1 text-gray-900">{userData.studentId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ชื่อ-นามสกุล
              </label>
              <p className="mt-1 text-gray-900">{userData.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                คณะ
              </label>
              <p className="mt-1 text-gray-900">{userData.faculty}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                สาขา
              </label>
              <p className="mt-1 text-gray-900">{userData.major}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ชั้นปี
              </label>
              <p className="mt-1 text-gray-900">{userData.year}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
