'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  TagIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface AcademicEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  location?: string;
  category: 'กิจกรรม' | 'ทั่วไป' | 'สำคัญ';
  color: string;
  semester?: string;
  endDate?: string; // For date ranges
}

const categories = {
  กิจกรรม: { name: 'กิจกรรม', color: '#3b82f6', icon: '🎭' },
  ทั่วไป: { name: 'ทั่วไป', color: '#6b7280', icon: '📋' },
  สำคัญ: { name: 'สำคัญ', color: '#dc2626', icon: '⭐' }
};

export default function AcademicCalendar() {
  const [events] = useState<AcademicEvent[]>([
    {
      id: '1',
      date: '15 ก.ค.67',
      title: 'เปิดรับสมัครนักศึกษาใหม่',
      description: 'เปิดรับสมัครนักศึกษาใหม่ ปีการศึกษา 2567 ผ่านระบบ TCAS',
      location: 'สำนักทะเบียนและประมวลผล',
      category: 'สำคัญ',
      color: '#dc2626',
      semester: '1/2567'
    },
    {
      id: '2',
      date: '20 ส.ค.67',
      title: 'วันปฐมนิเทศนักศึกษาใหม่',
      description: 'กิจกรรมต้อนรับน้องใหม่ และแนะนำระบบการเรียนการสอน',
      location: 'หอประชุมกาญจนาภิเษก',
      category: 'กิจกรรม',
      color: '#3b82f6',
      semester: '1/2567'
    },
    {
      id: '3',
      date: '25 ส.ค.67',
      endDate: '30 ส.ค.67',
      title: 'สัปดาห์ปฐมนิเทศคณะ',
      description: 'กิจกรรมปฐมนิเทศระดับคณะ แนะนำหลักสูตรและอาจารย์ประจำคณะ',
      location: 'คณะต่างๆ',
      category: 'กิจกรรม',
      color: '#3b82f6',
      semester: '1/2567'
    },
    {
      id: '4',
      date: '2 ก.ย.67',
      title: 'เปิดภาคเรียนที่ 1/2567',
      description: 'เริ่มการเรียนการสอนภาคเรียนที่ 1 ปีการศึกษา 2567',
      location: 'ทุกอาคาร',
      category: 'สำคัญ',
      color: '#dc2626',
      semester: '1/2567'
    },
    {
      id: '5',
      date: '15 ต.ค.67',
      title: 'วันหยุดนักขัตฤกษ์',
      description: 'วันคล้ายวันสวรรคต พระบาทสมเด็จพระบรมชนกาธิเบศร มหาภูมิพลอดุลยเดชมหาราช',
      category: 'ทั่วไป',
      color: '#6b7280',
      semester: '1/2567'
    },
    {
      id: '6',
      date: '28 ต.ค.67',
      endDate: '1 พ.ย.67',
      title: 'สอบกลางภาค',
      description: 'การสอบประเมินผลกลางภาคเรียนที่ 1/2567',
      location: 'อาคารเรียนและสอบ',
      category: 'สำคัญ',
      color: '#dc2626',
      semester: '1/2567'
    },
    {
      id: '7',
      date: '15 พ.ย.67',
      title: 'งานสัปดาห์วิทยาศาสตร์',
      description: 'จัดแสดงผลงานวิจัยและนวัตกรรมด้านวิทยาศาสตร์และเทคโนโลยี',
      location: 'คณะวิทยาศาสตร์',
      category: 'กิจกรรม',
      color: '#3b82f6',
      semester: '1/2567'
    },
    {
      id: '8',
      date: '5 ธ.ค.67',
      title: 'วันคล้ายวันพระราชสมภพ ร.9',
      description: 'วันหยุดราชการ วันคล้ายวันพระราชสมภพ พระบาทสมเด็จพระเจ้าอยู่หัว',
      category: 'ทั่วไป',
      color: '#6b7280',
      semester: '1/2567'
    },
    {
      id: '9',
      date: '16 ธ.ค.67',
      endDate: '20 ธ.ค.67',
      title: 'สอบปลายภาค',
      description: 'การสอบประเมินผลปลายภาคเรียนที่ 1/2567',
      location: 'อาคารเรียนและสอบ',
      category: 'สำคัญ',
      color: '#dc2626',
      semester: '1/2567'
    },
    {
      id: '10',
      date: '10 ม.ค.68',
      title: 'เปิดภาคเรียนที่ 2/2567',
      description: 'เริ่มการเรียนการสอนภาคเรียนที่ 2 ปีการศึกษา 2567',
      location: 'ทุกอาคาร',
      category: 'สำคัญ',
      color: '#dc2626',
      semester: '2/2567'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  // Function to parse Thai date and check if it has passed
  const isEventCompleted = (event: AcademicEvent): boolean => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();

    // Parse Thai date format (e.g., "15 ก.ค.67" or "28 ต.ค.67")
    const parseThaiDate = (dateStr: string): Date | null => {
      const thaiMonths: { [key: string]: number } = {
        'ม.ค.': 1, 'ก.พ.': 2, 'มี.ค.': 3, 'เม.ย.': 4, 'พ.ค.': 5, 'มิ.ย.': 6,
        'ก.ค.': 7, 'ส.ค.': 8, 'ก.ย.': 9, 'ต.ค.': 10, 'พ.ย.': 11, 'ธ.ค.': 12
      };

      const parts = dateStr.trim().split(' ');
      if (parts.length !== 2) return null;

      const day = parseInt(parts[0]);
      const monthStr = parts[1];
      
      if (isNaN(day)) return null;

      let year: number;
      let month: number;

      // Handle month-year format (e.g., "ก.ค.67")
      if (monthStr.includes('.')) {
        const monthParts = monthStr.split('.');
        if (monthParts.length === 3) {
          const monthKey = `${monthParts[0]}.${monthParts[1]}.`;
          month = thaiMonths[monthKey];
          year = parseInt(monthParts[2]);
          
          if (!month || isNaN(year)) return null;
          
          // Convert Thai year to Western year
          if (year < 100) {
            year = year + 2500; // Convert 67 to 2567
          }
          if (year > 2400) {
            year = year - 543; // Convert Buddhist year to Christian year
          }
        } else {
          return null;
        }
      } else {
        return null;
      }

      return new Date(year, month - 1, day);
    };

    const eventDate = parseThaiDate(event.date);
    if (!eventDate) return false;

    const endDate = event.endDate ? parseThaiDate(event.endDate) : eventDate;
    if (!endDate) return false;

    // Event is completed if current date is after the end date
    return today > endDate;
  };

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const eventId = entry.target.getAttribute('data-event-id');
            if (eventId) {
              setVisibleEvents(prev => new Set([...prev, eventId]));
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    const eventElements = document.querySelectorAll('[data-event-id]');
    eventElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [events]);

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const completedCount = events.filter(e => isEventCompleted(e)).length;
  const progressPercentage = (completedCount / events.length) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f4' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-7 h-7 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  📚 ปฏิทินการศึกษา
                </h1>
                <p className="text-blue-100 text-sm mt-1">
                  ติดตามกิจกรรมและการดำเนินงานของมหาวิทยาลัย
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Academic Year Info */}
              <div className="text-right">
                <div className="text-xs text-blue-100">ปีการศึกษา 2567</div>
                <div className="text-sm font-medium text-white">
                  {completedCount}/{events.length} กิจกรรมผ่านไปแล้ว
                </div>
              </div>
              
              {/* Current Date */}
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <div className="text-xs text-blue-100">วันที่ปัจจุบัน</div>
                <div className="text-sm font-medium text-white">
                  {new Date().toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-blue-500 bg-opacity-30 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500 bg-white shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {Object.entries(categories).map(([key, cat]) => {
            const count = events.filter(e => e.category === key).length;
            const completed = events.filter(e => e.category === key && isEventCompleted(e)).length;
            
            return (
              <div key={key} className="bg-white rounded-xl p-4 shadow-sm border-l-4" style={{ borderColor: cat.color }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium" style={{ color: '#182411' }}>{cat.name}</span>
                    </div>
                    <div className="text-sm" style={{ color: '#174d20' }}>
                      {completed}/{count} ผ่านไปแล้ว
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: cat.color }}>{count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8" style={{ borderLeft: '4px solid #3b82f6' }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหากิจกรรม, สอบ, หรือเหตุการณ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-black"
                style={{ backgroundColor: 'white' }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                ทั้งหมด
              </button>
              {Object.entries(categories).map(([key, cat]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === key 
                      ? 'text-white shadow-md' 
                      : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{ backgroundColor: selectedCategory === key ? cat.color : undefined }}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-8 relative">
          <div className="ml-[240px] relative flex flex-col" ref={timelineRef}>
            {/* Vertical line */}
            <div className="absolute top-0 bottom-0 left-[30px] w-[3px] bg-gradient-to-b from-blue-400 via-purple-400 to-blue-400 z-0 rounded-full" />

            {filteredEvents.map((event, idx) => {
              const isVisible = visibleEvents.has(event.id);
              const isCompleted = isEventCompleted(event);
              const displayDate = event.endDate ? `${event.date} - ${event.endDate}` : event.date;
              
              return (
                <div 
                  key={event.id} 
                  data-event-id={event.id}
                  className={`relative flex mb-12 group transition-all duration-700 ${
                    isVisible 
                      ? isCompleted 
                        ? 'opacity-40 translate-x-0' 
                        : 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: `${idx * 150}ms` }}
                >
                  {/* Date */}
                  <div className="absolute -left-[240px] w-[220px] text-right top-0">
                    <div className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl shadow-sm border-l-4 transition-all duration-200 group-hover:shadow-md"
                         style={{ borderColor: event.color }}>
                      <div className="flex items-center justify-end gap-2 text-xs mb-2 text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span>วันที่</span>
                      </div>
                      <div className="text-sm font-bold mb-1 text-black">
                        {displayDate}
                      </div>
                      {event.semester && (
                        <div className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full inline-block">
                          {event.semester}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Point */}
                  <div className="relative w-[60px] flex justify-center items-center">
                    <div 
                      className={`w-5 h-5 rounded-full border-4 border-white shadow-xl transition-all duration-300 group-hover:scale-150 ${
                        isCompleted ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        backgroundColor: isCompleted ? '#10b981' : event.color,
                        opacity: isCompleted ? 1 : 0.7
                      }}
                    />
                    {isCompleted && (
                      <div className="w-3 h-3 text-white absolute flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>

                  {/* Event Content */}
                  <div className="flex-1 pl-6">
                    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 transition-all duration-200 group-hover:shadow-xl group-hover:scale-105 ${
                      isCompleted ? 'bg-green-50' : ''
                    }`}
                         style={{ borderColor: isCompleted ? '#10b981' : event.color }}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{categories[event.category].icon}</span>
                            <span className="text-xs px-3 py-1 rounded-full text-white font-medium"
                                  style={{ backgroundColor: event.color }}>
                              {categories[event.category].name}
                            </span>
                            {isCompleted && (
                              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">
                                ✅ ผ่านไปแล้ว
                              </span>
                            )}
                            {!isCompleted && (
                              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                                🔮 กำลังจะมาถึง
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-xl mb-3" style={{ color: '#182411' }}>
                            {event.title}
                          </h3>
                          <p className="text-sm leading-relaxed mb-3" style={{ color: '#174d20' }}>
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <TagIcon className="w-3 h-3" />
                              <span>สถานที่: {event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <BookOpenIcon className="w-20 h-20 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">ไม่พบกิจกรรมที่ตรงกับการค้นหา</h3>
                <p className="text-gray-500">ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
