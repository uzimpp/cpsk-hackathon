"use client";

import { useState } from "react";
import { ChevronDownIcon, ChatBubbleLeftIcon, HeartIcon, EyeIcon } from "@heroicons/react/24/outline";

// Type definitions
interface Reply {
  id: number;
  author: string;
  content: string;
  timeAgo: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  faculty: string;
  category: string;
  author: string;
  timeAgo: string;
  replies: number;
  likes: number;
  views: number;
  replies_data: Reply[];
}

// ข้อมูลคณะ
const faculties = [
  "ทุกคณะ",
  "คณะเกษตร",
  "คณะบริหารธุรกิจ",
  "คณะประมง",
  "คณะมนุษยศาสตร์",
  "คณะวนศาสตร์",
  "คณะวิทยาศาสตร์",
  "คณะวิศวกรรมศาสตร์",
  "คณะศึกษาศาสตร์",
  "คณะเศรษฐศาสตร์",
  "คณะสถาปัตยกรรมศาสตร์",
  "คณะสังคมศาสตร์",
  "คณะสัตวแพทยศาสตร์",
  "คณะสิ่งแวดล้อม",
  "คณะอุตสาหกรรมเกษตร",
  "คณะเทคนิคการสัตวแพทย์",
  "แพทยศาสตร์",
  "นานาชาติ"
];

// ข้อมูลหมวดหมู่
const categories = [
  "การเรียน",
  "การแต่งกาย",
  "กิจกรรม",
  "ทั่วไป"
];

// ข้อมูลตัวอย่างโพส
const initialPosts: Post[] = [
  {
    id: 1,
    title: "ขอคำแนะนำเรื่องการเรียนภาคฤดูร้อน",
    content: "อยากถามว่าการเรียนภาคฤดูร้อนจะเหนื่อยมากไหมครับ และมีคำแนะนำอะไรบ้าง",
    faculty: "คณะวิศวกรรมศาสตร์",
    category: "การเรียน",
    author: "นศ.วิศวกรรม",
    timeAgo: "2 ชั่วโมงที่แล้ว",
    replies: 12,
    likes: 5,
    views: 45,
    replies_data: []
  },
  {
    id: 2,
    title: "หาเพื่อนทำงานกลุ่มวิชา Data Structure",
    content: "มีใครเรียนวิชา Data Structure ที่อยากทำงานกลุ่มด้วยกันไหมครับ",
    faculty: "คณะวิทยาศาสตร์",
    category: "การเรียน",
    author: "คอมพิวเตอร์ปี 2",
    timeAgo: "4 ชั่วโมงที่แล้ว",
    replies: 8,
    likes: 3,
    views: 32,
    replies_data: []
  },
  {
    id: 3,
    title: "กฎระเบียบการแต่งกายของมหาลัย",
    content: "ใครรู้กฎการแต่งกายสำหรับการสอบปลายภาคบ้างครับ",
    faculty: "คณะมนุษยศาสตร์",
    category: "การแต่งกาย",
    author: "นักศึกษาใหม่",
    timeAgo: "6 ชั่วโมงที่แล้ว",
    replies: 5,
    likes: 2,
    views: 28,
    replies_data: []
  }
];

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedFaculty, setSelectedFaculty] = useState("ทุกคณะ");
  const [selectedCategory, setSelectedCategory] = useState("ทุกหมวดหมู่");
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    faculty: "คณะเกษตร",
    category: "การเรียน"
  });
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");

  // ฟังก์ชันสร้างโพสใหม่
  const handleCreatePost = () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post: Post = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        faculty: newPost.faculty,
        category: newPost.category,
        author: "ผู้ใช้งาน",
        timeAgo: "เพิ่งโพส",
        replies: 0,
        likes: 0,
        views: 1,
        replies_data: []
      };
      setPosts([post, ...posts]);
      setNewPost({ title: "", content: "", faculty: "คณะเกษตร", category: "การเรียน" });
      setIsCreatePostOpen(false);
    }
  };

  // ฟังก์ชันตอบกระทู้
  const handleReply = (postId: number) => {
    if (replyText.trim()) {
      setPosts(posts.map(post => {
        if (post.id === postId) {
          const newReply: Reply = {
            id: Date.now(),
            author: "ผู้ใช้งาน",
            content: replyText,
            timeAgo: "เพิ่งตอบ"
          };
          return {
            ...post,
            replies: post.replies + 1,
            replies_data: [...post.replies_data, newReply]
          };
        }
        return post;
      }));
      setReplyText("");
    }
  };

  // ฟิลเตอร์โพสตามคณะและหมวดหมู่
  const filteredPosts = posts.filter(post => {
    const facultyMatch = selectedFaculty === "ทุกคณะ" || post.faculty === selectedFaculty;
    const categoryMatch = selectedCategory === "ทุกหมวดหมู่" || post.category === selectedCategory;
    return facultyMatch && categoryMatch;
  });

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-dark mb-2">กระทู้ถาม-ตอบ</h1>
            <p className="text-dark opacity-70">แลกเปลี่ยนความรู้และประสบการณ์กับเพื่อนนักศึกษา</p>
          </div>
          <button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-green text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            + สร้างกระทู้ใหม่
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Faculty Filter */}
          <div className="relative">
            <label className="block text-dark font-medium mb-2">เลือกคณะ:</label>
            <div className="relative">
              <button
                onClick={() => setIsFacultyDropdownOpen(!isFacultyDropdownOpen)}
                className="w-full bg-white border-2 border-light-green text-dark px-4 py-2 rounded-lg flex justify-between items-center hover:border-green transition-colors"
              >
                <span>{selectedFaculty}</span>
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              
              {isFacultyDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-2 border-light-green rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedFaculty("ทุกคณะ");
                      setIsFacultyDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-light-green text-dark"
                  >
                    ทุกคณะ
                  </button>
                  {faculties.map((faculty) => (
                    <button
                      key={faculty}
                      onClick={() => {
                        setSelectedFaculty(faculty);
                        setIsFacultyDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-light-green text-dark"
                    >
                      {faculty}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="relative">
            <label className="block text-dark font-medium mb-2">เลือกหมวดหมู่:</label>
            <div className="relative">
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="w-full bg-white border-2 border-light-green text-dark px-4 py-2 rounded-lg flex justify-between items-center hover:border-green transition-colors"
              >
                <span>{selectedCategory}</span>
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              
              {isCategoryDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-white border-2 border-light-green rounded-lg mt-1 shadow-lg z-10 max-h-60 overflow-y-auto">
                  <button
                    onClick={() => {
                      setSelectedCategory("ทุกหมวดหมู่");
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-light-green text-dark"
                  >
                    ทุกหมวดหมู่
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-light-green text-dark"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white border-2 border-light-green rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-block bg-light-green text-dark-green px-3 py-1 rounded-full text-sm font-medium">
                      {post.faculty}
                    </span>
                    <span className="inline-block bg-green text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-2">{post.title}</h3>
                  <p className="text-dark opacity-80 mb-3">{post.content}</p>
                  <div className="flex items-center text-sm text-dark opacity-60 space-x-4">
                    <span>โดย {post.author}</span>
                    <span>•</span>
                    <span>{post.timeAgo}</span>
                  </div>
                </div>
              </div>

              {/* Post Stats */}
              <div className="flex items-center justify-between border-t border-light-green pt-4">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-1 text-dark opacity-70">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span className="text-sm">{post.replies} ความเห็น</span>
                  </div>
                  <div className="flex items-center space-x-1 text-dark opacity-70">
                    <HeartIcon className="w-4 h-4" />
                    <span className="text-sm">{post.likes} ถูกใจ</span>
                  </div>
                  <div className="flex items-center space-x-1 text-dark opacity-70">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{post.views} การดู</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
                  className="text-green hover:text-dark-green font-medium text-sm"
                >
                  {selectedPost === post.id ? "ซ่อนความเห็น" : "ดูความเห็น/ตอบกลับ"}
                </button>
              </div>

              {/* Replies Section */}
              {selectedPost === post.id && (
                <div className="mt-6 border-t border-light-green pt-6">
                  {/* Reply Form */}
                  <div className="mb-6">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="แสดงความเห็น..."
                      className="w-full border-2 border-light-green rounded-lg p-3 text-dark resize-none focus:border-green focus:outline-none"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => handleReply(post.id)}
                        className="bg-green text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                      >
                        ตอบกลับ
                      </button>
                    </div>
                  </div>

                  {/* Existing Replies */}
                  <div className="space-y-4">
                    {post.replies_data.map((reply) => (
                      <div key={reply.id} className="bg-light-green bg-opacity-30 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-dark">{reply.author}</span>
                          <span className="text-sm text-dark opacity-60">{reply.timeAgo}</span>
                        </div>
                        <p className="text-dark">{reply.content}</p>
                      </div>
                    ))}
                    {post.replies_data.length === 0 && (
                      <p className="text-dark opacity-60 text-center py-4">ยังไม่มีความเห็น</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-dark opacity-60 text-lg">ไม่พบกระทู้ในเงื่อนไขที่เลือก</p>
            </div>
          )}
        </div>

        {/* Create Post Modal */}
        {isCreatePostOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-dark mb-6">สร้างกระทู้ใหม่</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-dark font-medium mb-2">เลือกคณะ:</label>
                  <select
                    value={newPost.faculty}
                    onChange={(e) => setNewPost({...newPost, faculty: e.target.value})}
                    className="w-full border-2 border-light-green rounded-lg p-3 text-dark focus:border-green focus:outline-none"
                  >
                    {faculties.map((faculty) => (
                      <option key={faculty} value={faculty}>{faculty}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">เลือกหมวดหมู่:</label>
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                    className="w-full border-2 border-light-green rounded-lg p-3 text-dark focus:border-green focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">หัวข้อ:</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="หัวข้อกระทู้"
                    className="w-full border-2 border-light-green rounded-lg p-3 text-dark focus:border-green focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">เนื้อหา:</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="เขียนรายละเอียด..."
                    className="w-full border-2 border-light-green rounded-lg p-3 text-dark resize-none focus:border-green focus:outline-none"
                    rows={6}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setIsCreatePostOpen(false)}
                  className="px-6 py-2 border-2 border-light-green text-dark rounded-lg hover:bg-light-green transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-6 py-2 bg-green text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  โพสกระทู้
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
