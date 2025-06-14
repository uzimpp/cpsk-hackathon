'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

// Function to get news data from JSON file
async function getNewsData() {
    try {
        // ในอนาคตสามารถเปลี่ยนเป็น API call ได้
        const res = await fetch('/data/news.json', {
            cache: 'no-store' // เพื่อให้ได้ข้อมูลล่าสุดเสมอ
        })
        if (!res.ok) {
            throw new Error('Failed to fetch news data')
        }
        return await res.json()
    } catch (error) {
        console.error('Error loading news data:', error)
        // Fallback data ในกรณีที่โหลดไฟล์ไม่ได้
        return {
            "featuredNews": {
                "id": 1,
                "title": "ข่าวสำคัญ - โหลดข้อมูลไม่ได้",
                "excerpt": "ไม่สามารถโหลดข้อมูลข่าวได้ กรุณาลองใหม่อีกครั้ง",
                "image": "/logo.png",
                "date": "2024-01-15",
                "category": "ข่าวทั่วไป"
            },
            "newsList": [],
            "categories": ["ข่าวทั่วไป"]
        }
    }
}

export default function NewsPage() {
    const [newsData, setNewsData] = useState<any>(null)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [filteredNews, setFilteredNews] = useState<any[]>([])

    useEffect(() => {
        // Load news data when component mounts
        getNewsData().then(data => {
            setNewsData(data)
            setFilteredNews(data.newsList)
        })
    }, [])

    useEffect(() => {
        // Filter news when category changes
        if (newsData) {
            if (selectedCategory) {
                const filtered = newsData.newsList.filter((news: any) => news.category === selectedCategory)
                setFilteredNews(filtered)
            } else {
                setFilteredNews(newsData.newsList)
            }
        }
    }, [selectedCategory, newsData])

    const handleCategoryClick = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null) // ถ้าคลิกหมวดหมู่เดิมให้แสดงทั้งหมด
        } else {
            setSelectedCategory(category)
        }
    }

    if (!newsData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">กำลังโหลดข่าวสาร...</p>
                </div>
            </div>
        )
    }

    const featuredNews = newsData.featuredNews
    const categories = newsData.categories

    const sidebarNews = newsData.newsList.slice(0, 5).map((news: any, index: number) => ({
        id: news.id,
        title: news.title,
        date: news.date
    }))

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">ข่าวสาร</h1>
                    <p className="text-gray-600 mt-2">อัพเดทข่าวสารล่าสุด</p>
                    {selectedCategory && (
                        <div className="mt-3 flex items-center">
                            <span className="text-sm text-gray-500">กำลังแสดงข่าวในหมวดหมู่:</span>
                            <span className="ml-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {selectedCategory}
                            </span>
                            <button 
                                onClick={() => setSelectedCategory(null)}
                                className="ml-2 text-sm text-blue-600 hover:text-blue-800"
                            >
                                แสดงทั้งหมด
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Featured News - แสดงเฉพาะเมื่อไม่ได้กรองหมวดหมู่ */}
                        {!selectedCategory && (
                            <section className="mb-12">
                                <Link href={`/news/${featuredNews.id}`} className="block">
                                    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                                        <div className="relative h-96">
                                            <Image
                                                src={featuredNews.image}
                                                alt={featuredNews.title}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                    {featuredNews.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                                                {featuredNews.title}
                                            </h2>
                                            <p className="text-gray-600 text-lg leading-relaxed mb-4">
                                                {featuredNews.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">{featuredNews.date}</span>
                                                <span className="text-blue-600 font-medium text-sm">อ่านต่อ →</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </section>
                        )}

                        {/* News Grid */}
                        <section>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {selectedCategory ? `ข่าว${selectedCategory}` : 'ข่าวล่าสุด'}
                                </h3>
                                <span className="text-sm text-gray-500">
                                    {filteredNews.length} ข่าว
                                </span>
                            </div>
                            
                            {filteredNews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredNews.map((news: any) => (
                                        <Link key={news.id} href={`/news/${news.id}`}>
                                            <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                                                <div className="relative h-48">
                                                    <Image
                                                        src={news.image}
                                                        alt={news.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute top-3 left-3">
                                                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                                            {news.category}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="p-4 flex flex-col h-full">
                                                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                                                        {news.title}
                                                    </h4>
                                                    <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-grow">
                                                        {news.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-xs text-gray-500">{news.date}</span>
                                                        <span className="text-blue-600 font-medium text-xs">อ่านต่อ →</span>
                                                    </div>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📰</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">ไม่พบข่าวในหมวดหมู่นี้</h3>
                                    <p className="text-gray-500">ลองเลือกหมวดหมู่อื่น หรือดูข่าวทั้งหมด</p>
                                </div>
                            )}
                        </section>

                        {/* Load More Button - แสดงเฉพาะเมื่อมีข่าวมากกว่า 6 ข่าว */}
                        {filteredNews.length > 6 && (
                            <div className="text-center mt-12">
                                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                                    โหลดข่าวเพิ่มเติม
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            {/* Popular News */}
                            <section className="bg-white rounded-lg shadow-md p-6 mb-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                                    ข่าวยอดนิยม
                                </h3>
                                <div className="space-y-4">
                                    {sidebarNews.map((news: any, index: number) => (
                                        <Link key={news.id} href={`/news/${news.id}`}>
                                            <article className="flex items-start space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors cursor-pointer">
                                                <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                                                    {index + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 hover:text-blue-600 transition-colors">
                                                        {news.title}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {news.date}
                                                    </p>
                                                </div>
                                            </article>
                                        </Link>
                                    ))}
                                </div>
                            </section>

                            {/* Categories */}
                            <section className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b">
                                    หมวดหมู่ข่าว
                                </h3>
                                <div className="space-y-2">
                                    {categories.map((category: string) => (
                                        <button 
                                            key={category} 
                                            onClick={() => handleCategoryClick(category)}
                                            className={`block w-full text-left px-3 py-2 rounded transition-colors ${
                                                selectedCategory === category 
                                                    ? 'bg-blue-100 text-blue-800 font-semibold' 
                                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
