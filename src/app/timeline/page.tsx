'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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


interface CSVRow {
  กำหนดการ: string;
  หลักสูตรภาษาไทย: string;
  หลักสูตรนานาชาติ: string;
}

const categories = {
  กิจกรรม: { name: 'กิจกรรม', color: '#50c34e', icon: '🎭' },
  ทั่วไป: { name: 'ทั่วไป', color: '#b3deb2', icon: '📋' },
  สำคัญ: { name: 'สำคัญ', color: '#174d20', icon: '⭐' }
};

const semesterData = {
  'first': { name: 'เทอมต้น', file: '/data/first-sem.csv', color: '#50c34e' },
  'second': { name: 'เทอมปลาย', file: '/data/sec-sem.csv', color: '#174d20' }, 
  'summer': { name: 'เทอมภาคฤดูร้อน', file: '/data/summer.csv', color: '#b3deb2' }
};

export default function AcademicCalendar() {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [csvData, setCsvData] = useState<{ [key: string]: CSVRow[] }>({});
  const [selectedSemester, setSelectedSemester] = useState<'first' | 'second' | 'summer'>('first');
  const [isInternational, setIsInternational] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleEvents, setVisibleEvents] = useState<Set<string>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  // Load CSV data
  useEffect(() => {
    const loadCSVData = async () => {
      const data: { [key: string]: CSVRow[] } = {};
      
      for (const [key, semester] of Object.entries(semesterData)) {
        try {
          const response = await fetch(semester.file);
          const csvText = await response.text();
          const rows = csvText.split('\n').filter(row => row.trim());
          const headers = rows[0].split(',');
          
          const parsedData = rows.slice(1).map((row, index) => {
            const values = row.split(',');
            return {
              กำหนดการ: values[0] || '',
              หลักสูตรภาษาไทย: values[1] || '',
              หลักสูตรนานาชาติ: values[2] || ''
            };
          }).filter(row => row.กำหนดการ.trim() !== '');
          
          data[key] = parsedData;
        } catch (error) {
          console.error(`Error loading ${semester.name}:`, error);
          data[key] = [];
        }
      }
      
      setCsvData(data);
    };

    loadCSVData();
  }, []);

  // Convert CSV data to events
  useEffect(() => {
    if (!csvData[selectedSemester]) {
      setEvents([]);
      return;
    }

    const currentData = csvData[selectedSemester];
    const newEvents: AcademicEvent[] = [];

    currentData.forEach((row, index) => {
      const title = row.กำหนดการ;
      const dateText = isInternational ? row.หลักสูตรนานาชาติ : row.หลักสูตรภาษาไทย;
      
      if (!title || !dateText || dateText === '-') return;

             // Determine category based on keywords
       let category: 'กิจกรรม' | 'ทั่วไป' | 'สำคัญ' = 'ทั่วไป';
       let color = '#b3deb2';

             if (title.includes('สอบ') || title.includes('เปิดภาค') || title.includes('ลงทะเบียน')) {
         category = 'สำคัญ';
         color = '#174d20';
       } else if (title.includes('เปลี่ยนแปลง') || title.includes('ถอนรายวิชา')) {
         category = 'ทั่วไป';
         color = '#50c34e';
       }

      newEvents.push({
        id: `${selectedSemester}-${index}`,
        date: dateText,
        title: title,
        description: `${title} - ${semesterData[selectedSemester].name} ${isInternational ? 'หลักสูตรนานาชาติ' : 'หลักสูตรภาษาไทย'}`,
        category: category,
        color: color,
        semester: semesterData[selectedSemester].name
      });
    });

    setEvents(newEvents);
  }, [csvData, selectedSemester, isInternational]);

  // Function to parse Thai date and check if it has passed
  const isEventCompleted = (event: AcademicEvent): boolean => {
    // For now, return false since the dates are complex ranges
    // Could be enhanced to parse the date ranges properly
    return false;
  };

  // Animation on scroll - Optimized
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newVisibleIds: string[] = [];
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const eventId = entry.target.getAttribute('data-event-id');
            if (eventId) {
              newVisibleIds.push(eventId);
            }
          }
        });
        
        if (newVisibleIds.length > 0) {
          setVisibleEvents(prev => {
            const updated = new Set(prev);
            newVisibleIds.forEach(id => updated.add(id));
            return updated;
          });
        }
      },
      { 
        threshold: 0.1, // Reduced threshold for faster triggering
        rootMargin: '100px 0px' // Pre-load animations
      }
    );

    const eventElements = document.querySelectorAll('[data-event-id]');
    eventElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [events]);

  // Filter events - Memoized
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [events, searchTerm, selectedCategory]);

  const completedCount = events.filter(e => isEventCompleted(e)).length;
  const progressPercentage = events.length > 0 ? (completedCount / events.length) * 100 : 0;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f4f6f4' }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 shadow-lg sticky top-0 z-10" style={{ background: 'linear-gradient(135deg, #50c34e 0%, #174d20 100%)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                <AcademicCapIcon className="w-7 h-7" style={{ color: '#50c34e' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  📚 ปฏิทินการศึกษา
                </h1>
                <p className="text-green-100 text-sm mt-1">
                  ติดตามกิจกรรมและการดำเนินงานของมหาวิทยาลัย
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Academic Year Info */}
              <div className="text-right">
                <div className="text-xs text-green-100">ปีการศึกษา 2568</div>
                <div className="text-sm font-medium text-white">
                  {events.length} กิจกรรมทั้งหมด
                </div>
              </div>
              
              {/* Current Date */}
              <div className="bg-white bg-opacity-20 rounded-lg px-4 py-2">
                <div className="text-xs text-green-100">วันที่ปัจจุบัน</div>
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
          <div className="mt-4 bg-green-500 bg-opacity-30 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all duration-500 bg-white shadow-sm"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Semester Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8" style={{ borderLeft: '4px solid #50c34e' }}>
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Semester Buttons */}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#182411' }}>เลือกภาคการศึกษา</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {Object.entries(semesterData).map(([key, semester]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSemester(key as 'first' | 'second' | 'summer')}
                                                                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                        selectedSemester === key
                          ? 'text-white shadow-lg transform scale-105'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                      style={{
                        backgroundColor: selectedSemester === key ? semester.color : undefined,
                        borderColor: selectedSemester === key ? semester.color : undefined,
                        color: selectedSemester !== key ? '#182411' : undefined
                      }}
                  >
                    {semester.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Toggle */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4" style={{ color: '#182411' }}>หลักสูตร</h3>
              <div className="flex items-center gap-4 bg-gray-100 rounded-full p-2">
                <span className={`text-sm font-medium transition-colors duration-200`} style={{ color: !isInternational ? '#50c34e' : '#b3deb2' }}>
                  ไทย
                </span>
                <button
                  onClick={() => setIsInternational(!isInternational)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
                  style={{ 
                    backgroundColor: isInternational ? '#174d20' : '#50c34e'
                  }}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                      isInternational ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium transition-colors duration-200`} style={{ color: isInternational ? '#174d20' : '#b3deb2' }}>
                  นานาชาติ
                </span>
              </div>
            </div>
          </div>
        </div>



        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8" style={{ borderLeft: '4px solid #50c34e' }}>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหากิจกรรม, สอบ, หรือเหตุการณ์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none"
                style={{ color: '#182411', backgroundColor: 'white' }}
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'all' 
                    ? 'text-white shadow-md' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === 'all' ? '#50c34e' : undefined,
                  color: selectedCategory !== 'all' ? '#182411' : undefined
                }}
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
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === key ? cat.color : undefined,
                    color: selectedCategory !== key ? '#182411' : undefined
                  }}
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
            <div className="absolute top-0 bottom-0 left-[30px] w-[3px] z-0 rounded-full" style={{ background: 'linear-gradient(to bottom, #50c34e, #174d20, #50c34e)' }} />

            {filteredEvents.map((event, idx) => {
              const isVisible = visibleEvents.has(event.id);
              const isCompleted = isEventCompleted(event);
              const displayDate = event.endDate ? `${event.date} - ${event.endDate}` : event.date;
              
              return (
                <div 
                  key={event.id} 
                  data-event-id={event.id}
                  className={`relative flex mb-12 group transition-opacity duration-500 ${
                    isVisible 
                      ? isCompleted 
                        ? 'opacity-40' 
                        : 'opacity-100'
                      : 'opacity-0'
                  }`}
                  style={{ 
                    transitionDelay: `${Math.min(idx * 100, 500)}ms`,
                    willChange: isVisible ? 'auto' : 'opacity'
                  }}
                >
                  {/* Date */}
                  <div className="absolute -left-[240px] w-[220px] text-right top-0">
                    <div className="bg-gradient-to-r from-white to-gray-50 p-4 rounded-xl shadow-sm border-l-4 transition-shadow duration-200 group-hover:shadow-md"
                         style={{ borderColor: event.color }}>
                      <div className="flex items-center justify-end gap-2 text-xs mb-2 text-gray-500">
                        <CalendarIcon className="w-3 h-3" />
                        <span>วันที่</span>
                      </div>
                      <div className="text-sm font-bold mb-1" style={{ color: '#182411' }}>
                        {displayDate}
                      </div>
                      {event.semester && (
                        <div className="text-xs px-2 py-1 rounded-full inline-block" style={{ backgroundColor: '#b3deb2', color: '#174d20' }}>
                          {event.semester}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Timeline Point */}
                  <div className="relative w-[60px] flex justify-center items-center">
                    <div 
                      className={`w-5 h-5 rounded-full border-4 border-white shadow-xl transition-transform duration-200 group-hover:scale-125 ${
                        isCompleted ? 'animate-pulse' : ''
                      }`}
                      style={{ 
                        backgroundColor: isCompleted ? '#50c34e' : event.color,
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
                    <div className={`bg-white p-6 rounded-xl shadow-md border-l-4 transition-shadow duration-200 group-hover:shadow-lg ${
                      isCompleted ? 'bg-green-50' : ''
                    }`}
                         style={{ borderColor: isCompleted ? '#50c34e' : event.color }}>
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
                              <span className="text-xs px-3 py-1 rounded-full font-medium" style={{ backgroundColor: '#b3deb2', color: '#174d20' }}>
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
