export default function Timeline() {
  return (
    <div className="bg-[#f4f4f4] py-20 px-10 min-h-screen">
      <h1 className="text-center text-2xl mb-4 text-[#003f3f]">ปฏิทิน</h1>
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-md relative">
        <div className="ml-[200px] relative flex flex-col">
          {/* vertical line */}
          <div className="absolute top-0 bottom-0 left-[25px] w-[2px] bg-gray-300 z-0" />

          {/* timeline event */}
          {[
            { date: '1 มิ.ย.68 - 4 มิ.ย.68', desc: 'ประสูติ เดินได้ 7 ก้าว' },
            { date: '5 มิ.ย.68 - 30 มิ.ย.68', desc: 'ตรัสรู้' },
            { date: '1 ก.ค.68 - 31 ก.ค.68', desc: 'ธัมมจักรกปปะวัตนสูตร' },
            { date: '2 ส.ค.68', desc: 'ตายไอเหี้ย' },
            { date: '9 ก.ย.68 - 11 ก.ย.68', desc: 'ข้อความ 5' },
          ].map((event, idx) => (
            <div key={idx} className="relative flex mb-10">
              <div className="absolute -left-[200px] w-[180px] text-right text-gray-700 top-0 whitespace-nowrap">
                {event.date}
              </div>
              <div className="relative w-[50px] flex justify-center items-center">
                <div className="w-2.5 h-2.5 bg-[#080a0d] rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-[#003f3f] text-base pl-2">{event.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
