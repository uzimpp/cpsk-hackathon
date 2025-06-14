import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// Function to get news data from JSON file
async function getNewsData() {
    try {
        // ในอนาคตสามารถเปลี่ยนเป็น API call ได้
        const res = await fetch(`${process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : ''}/data/news.json`, {
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
                "content": "<p>ไม่สามารถโหลดเนื้อหาข่าวได้</p>",
                "image": "/logo.png",
                "date": "2024-01-15",
                "category": "ข่าวทั่วไป",
                "author": "ระบบ",
                "tags": ["ข้อผิดพลาด"]
            },
            "newsList": []
        }
    }
}

async function getNewsById(id: string) {
    const data = await getNewsData()
    const newsId = parseInt(id)
    
    // หาข่าวจาก featuredNews
    if (data.featuredNews.id === newsId) {
        return data.featuredNews
    }
    
    // หาข่าวจาก newsList
    const news = data.newsList.find((item: any) => item.id === newsId)
    return news || null
}

export default async function NewsDetailPage({ params }: { params: { id: string } }) {
    const news = await getNewsById(params.id)
    
    if (!news) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <nav className="flex items-center space-x-2 text-sm text-gray-600">
                        <Link href="/news" className="hover:text-blue-600 transition-colors">
                            ข่าวสาร
                        </Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{news.category}</span>
                    </nav>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-4 py-8">
                {/* Article Header */}
                <header className="mb-8">
                    <div className="mb-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {news.category}
                        </span>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                        {news.title}
                    </h1>
                    
                    <div className="flex items-center text-gray-600 text-sm space-x-4 mb-6">
                        <span>โดย {news.author}</span>
                        <span>•</span>
                        <span>{new Date(news.date).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {news.tags.map((tag: string) => (
                            <span key={tag} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </header>

                {/* Featured Image */}
                <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
                    <Image
                        src={news.image}
                        alt={news.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Article Content */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    {/* Lead/Excerpt */}
                    <div className="text-xl text-gray-700 leading-relaxed mb-8 pb-6 border-b border-gray-200 font-medium">
                        {news.excerpt}
                    </div>

                    {/* Main Content */}
                    <div 
                        className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-gray-900 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:p-4 prose-blockquote:rounded"
                        dangerouslySetInnerHTML={{ __html: news.content }}
                    />
                </div>

                {/* Share & Back */}
                <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm">
                    <Link 
                        href="/news"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        ← กลับไปหน้าข่าวสาร
                    </Link>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-600 text-sm">แชร์ข่าวนี้:</span>
                        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            Facebook
                        </button>
                        <button className="text-blue-400 hover:text-blue-500 text-sm font-medium">
                            Twitter
                        </button>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                            Line
                        </button>
                    </div>
                </div>
            </article>
        </div>
    )
} 