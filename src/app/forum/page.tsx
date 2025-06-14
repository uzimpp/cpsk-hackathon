"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDownIcon,
  ChatBubbleLeftIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import postsData from "@/data/posts.json";
import repliesData from "@/data/replies.json";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import { getProfilePicUrl } from "@/utils/GetProfilePic";
import { formatDistanceToNow } from "date-fns";
import { th } from "date-fns/locale";
import { FaEye, FaHeart, FaComment } from "react-icons/fa";

// Type definitions
interface Reply {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    faculty: string;
    major: string;
    year: string;
    avatar: string;
  };
  createdAt: string;
  likeCount: number;
}

interface RepliesData {
  replies: {
    [key: string]: Reply[];
  };
}

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    faculty: string;
    major: string;
    year: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  replyCount?: number;
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
  "นานาชาติ",
];

// ข้อมูลหมวดหมู่
const categories = ["การเรียน", "การแต่งกาย", "กิจกรรม", "ทั่วไป"];

// ข้อมูลตัวอย่างโพส
const initialPosts: Post[] = [
  {
    id: "1",
    title: "ขอคำแนะนำเรื่องการเรียนภาคฤดูร้อน",
    content:
      "อยากถามว่าการเรียนภาคฤดูร้อนจะเหนื่อยมากไหมครับ และมีคำแนะนำอะไรบ้าง",
    author: {
      id: "1",
      name: "นศ.วิศวกรรม",
      faculty: "คณะวิศวกรรมศาสตร์",
      major: "วิศวกรรมศาสตร์",
      year: "2",
      avatar: "/avatar1.jpg",
    },
    createdAt: "2024-04-01T10:00:00",
    updatedAt: "2024-04-01T10:00:00",
    tags: ["การเรียน", "คณะวิศวกรรมศาสตร์"],
    viewCount: 45,
    likeCount: 5,
  },
  {
    id: "2",
    title: "หาเพื่อนทำงานกลุ่มวิชา Data Structure",
    content: "มีใครเรียนวิชา Data Structure ที่อยากทำงานกลุ่มด้วยกันไหมครับ",
    author: {
      id: "2",
      name: "คอมพิวเตอร์ปี 2",
      faculty: "คณะวิทยาศาสตร์",
      major: "วิทยาศาสตร์",
      year: "2",
      avatar: "/avatar2.jpg",
    },
    createdAt: "2024-04-01T12:00:00",
    updatedAt: "2024-04-01T12:00:00",
    tags: ["การเรียน", "คณะวิทยาศาสตร์"],
    viewCount: 32,
    likeCount: 3,
  },
  {
    id: "3",
    title: "กฎระเบียบการแต่งกายของมหาลัย",
    content: "ใครรู้กฎการแต่งกายสำหรับการสอบปลายภาคบ้างครับ",
    author: {
      id: "3",
      name: "นักศึกษาใหม่",
      faculty: "คณะมนุษยศาสตร์",
      major: "มนุษยศาสตร์",
      year: "1",
      avatar: "/avatar3.jpg",
    },
    createdAt: "2024-04-01T14:00:00",
    updatedAt: "2024-04-01T14:00:00",
    tags: ["การแต่งกาย", "คณะมนุษยศาสตร์"],
    viewCount: 28,
    likeCount: 2,
  },
];

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState("ทุกคณะ");
  const [selectedCategory, setSelectedCategory] = useState("ทุกหมวดหมู่");
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    faculty: "คณะเกษตร",
    category: "การเรียน",
  });
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [localPosts, setLocalPosts] = useState<Post[]>(postsData.posts);
  const [localReplies, setLocalReplies] = useState<RepliesData>(
    repliesData as RepliesData
  );
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  // Get all unique tags from posts
  const allTags = Array.from(new Set(localPosts.flatMap((post) => post.tags)));

  // Filter posts based on search query and selected tag
  const filteredPosts = localPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Get reply count for a post
  const getReplyCount = (postId: string) => {
    return (localReplies.replies[postId] || []).length;
  };

  // ฟังก์ชันสร้างโพสใหม่
  const handleCreatePost = async () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: {
          id: "new",
          name: "ผู้ใช้งาน",
          faculty: newPost.faculty,
          major: newPost.category,
          year: "1",
          avatar: "/avatar4.jpg",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [newPost.category],
        viewCount: 1,
        likeCount: 0,
      };

      const updatedPosts = [...localPosts, post];
      setLocalPosts(updatedPosts);

      // Save to JSON
      try {
        const response = await fetch("/api/forum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "posts",
            data: updatedPosts,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save post");
        }
      } catch (error) {
        console.error("Error saving post:", error);
        // Optionally show an error message to the user
      }

      setNewPost({
        title: "",
        content: "",
        faculty: "คณะเกษตร",
        category: "การเรียน",
      });
      setIsCreatePostOpen(false);
    }
  };

  // ฟังก์ชันตอบกระทู้
  const handleReply = async (postId: string) => {
    if (replyText.trim()) {
      const newReply: Reply = {
        id: `${postId}-${Date.now()}`,
        content: replyText,
        author: {
          id: "new",
          name: "ผู้ใช้งาน",
          faculty: "คณะเกษตร",
          major: "การเรียน",
          year: "1",
          avatar: "/avatar4.jpg",
        },
        createdAt: new Date().toISOString(),
        likeCount: 0,
      };

      const updatedReplies = {
        ...localReplies,
        replies: {
          ...localReplies.replies,
          [postId]: [...(localReplies.replies[postId] || []), newReply],
        },
      };

      setLocalReplies(updatedReplies);

      // Update reply count in the post based on actual replies length
      const updatedPosts = localPosts.map((post) =>
        post.id === postId
          ? { ...post, replyCount: updatedReplies.replies[postId].length }
          : post
      );
      setLocalPosts(updatedPosts);

      // Save to JSON
      try {
        // Save replies
        await fetch("/api/forum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "replies",
            data: updatedReplies,
          }),
        });

        // Save updated post
        await fetch("/api/forum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "posts",
            data: updatedPosts,
          }),
        });
      } catch (error) {
        console.error("Error saving reply:", error);
      }

      setReplyText("");
    }
  };

  // Handle post like
  const handlePostLike = (postId: string) => {
    setLocalPosts(
      localPosts.map((post) => {
        if (post.id === postId) {
          const isLiked = likedPosts.has(postId);
          setLikedPosts((prev) => {
            const newSet = new Set(prev);
            if (isLiked) {
              newSet.delete(postId);
            } else {
              newSet.add(postId);
            }
            return newSet;
          });
          return {
            ...post,
            likeCount: isLiked ? post.likeCount - 1 : post.likeCount + 1,
          };
        }
        return post;
      })
    );
  };

  // Handle reply like
  const handleReplyLike = (postId: string, replyId: string) => {
    setLocalReplies((prev) => {
      const postReplies = prev.replies[postId] || [];
      const updatedReplies = postReplies.map((reply) => {
        if (reply.id === replyId) {
          const isLiked = likedReplies.has(replyId);
          setLikedReplies((prev) => {
            const newSet = new Set(prev);
            if (isLiked) {
              newSet.delete(replyId);
            } else {
              newSet.add(replyId);
            }
            return newSet;
          });
          return {
            ...reply,
            likeCount: isLiked ? reply.likeCount - 1 : reply.likeCount + 1,
          };
        }
        return reply;
      });
      return { replies: { ...prev.replies, [postId]: updatedReplies } };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          KU Connect Forum
        </h1>
        <p className="text-gray-600 mb-6">
          แบ่งปันความคิดเห็นและพูดคุยกับเพื่อนๆ ในมหาวิทยาลัย
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center">
        <input
          type="text"
          placeholder="ค้นหาหัวข้อหรือเนื้อหา..."
          className="flex-1 px-4 py-2 border-2 border-[#22c55e] rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            className={`!px-4 !py-2 !rounded-full !bg-white !text-[#22c55e] !border !border-[#22c55e] !font-medium ${
              selectedTag === null ? "!bg-[#22c55e] !text-white" : ""
            }`}
            type="button"
            onClick={() => setSelectedTag(null)}
          >
            ทั้งหมด
          </Button>
          {allTags.map((tag) => (
            <Button
              key={tag}
              className={`!px-4 !py-2 !rounded-full !bg-white !text-[#22c55e] !border !border-[#22c55e] !font-medium ${
                selectedTag === tag ? "!bg-[#22c55e] !text-white" : ""
              }`}
              type="button"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <Link href={`/forum/${post.id}`} key={post.id} className="block">
            <Card className="mb-2 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 mb-2 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>{getReplyCount(post.id)} ความคิดเห็น</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handlePostLike(post.id);
                      }}
                      className="flex items-center gap-1 hover:text-[#22c55e] transition-colors"
                    >
                      <HeartIcon
                        className={`h-5 w-5 ${
                          likedPosts.has(post.id)
                            ? "fill-[#22c55e] text-[#22c55e]"
                            : ""
                        }`}
                      />
                      <span>{post.likeCount} ถูกใจ</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-5 w-5" />
                      <span>{post.viewCount} ดู</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 min-w-[180px] justify-end">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {post.author.faculty} • {post.author.major} ปี{" "}
                      {post.author.year}
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                    <img
                      src={getProfilePicUrl(post.author.avatar)}
                      alt={post.author.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/noprofilepic.png";
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <Card className="text-center py-12 mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ไม่พบโพสต์ที่ค้นหา
          </h3>
          <p className="text-gray-500">ลองค้นหาด้วยคำอื่นหรือล้างตัวกรอง</p>
        </Card>
      )}

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-dark mb-6">
              สร้างกระทู้ใหม่
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-dark font-medium mb-2">
                  เลือกคณะ:
                </label>
                <select
                  value={newPost.faculty}
                  onChange={(e) =>
                    setNewPost({ ...newPost, faculty: e.target.value })
                  }
                  className="w-full border-2 border-light-green rounded-lg p-3 text-dark focus:border-green focus:outline-none"
                >
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  เลือกหมวดหมู่:
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                  className="w-full border-2 border-light-green rounded-lg p-3 text-dark focus:border-green focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  หัวข้อ:
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="หัวข้อกระทู้"
                  className="w-full border-2 border-light-green rounded-lg p-3 text-dark focus:border-green focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-dark font-medium mb-2">
                  เนื้อหา:
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
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
  );
}
