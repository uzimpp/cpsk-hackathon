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

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ทุกหมวดหมู่");
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isTagPanelOpen, setIsTagPanelOpen] = useState(false);
  const [selectedSortOption, setSelectedSortOption] = useState("newest");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
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

  // Filter and sort posts based on search query, selected tag, faculty, and sort option
  const filteredAndSortedPosts = [...localPosts]
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        selectedTag.length === 0 ||
        selectedTag.some((tag) => post.tags.includes(tag));
      const matchesFaculty =
        selectedFaculty.length === 0 ||
        selectedFaculty.some((faculty) => post.author.faculty === faculty);
      return matchesSearch && matchesTag && matchesFaculty;
    })
    .sort((a, b) => {
      if (selectedSortOption === "newest") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (selectedSortOption === "oldest") {
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else if (selectedSortOption === "most_likes") {
        return b.likeCount - a.likeCount;
      } else if (selectedSortOption === "least_likes") {
        return a.likeCount - b.likeCount;
      } else if (selectedSortOption === "most_views") {
        return b.viewCount - a.viewCount;
      } else if (selectedSortOption === "least_views") {
        return a.viewCount - b.viewCount;
      }
      return 0;
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
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          KU Connect Forum
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          แบ่งปันความคิดเห็นและพูดคุยกับเพื่อนๆ ในมหาวิทยาลัย
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-6 mb-12">
        {/* Top row: Search, Faculty, หัวข้อ, Filter, Reset */}
        <div className="flex items-center gap-4 w-full">
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="search"
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* New Faculty Dropdown Button */}
          <Button
            className="!px-6 !py-3 !rounded-xl !bg-[#22c55e] !text-white !font-medium !text-lg transition-all hover:!bg-[#16a34a] flex items-center gap-2"
            type="button"
            onClick={() => {
              setIsFacultyDropdownOpen((prev) => !prev);
              setIsTagPanelOpen(false);
              setIsSortDropdownOpen(false);
            }}
          >
            คณะ
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isFacultyDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {/* หัวข้อ (Topic) Button */}
          <Button
            className="!px-6 !py-3 !rounded-xl !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-lg transition-all hover:!bg-gray-100 flex items-center gap-2"
            type="button"
            onClick={() => {
              setIsTagPanelOpen((prev) => !prev);
              setIsFacultyDropdownOpen(false);
              setIsSortDropdownOpen(false);
            }}
          >
            หัวข้อ
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isTagPanelOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>

          {/* Sort Button and Dropdown */}
          <div className="relative">
            <Button
              className="!px-6 !py-3 !rounded-xl !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-lg transition-all hover:!bg-gray-100 flex items-center gap-2"
              type="button"
              onClick={() => {
                setIsSortDropdownOpen((prev) => !prev);
                setIsFacultyDropdownOpen(false);
                setIsTagPanelOpen(false);
              }}
            >
              {selectedSortOption === "newest"
                ? "ใหม่สุด"
                : selectedSortOption === "oldest"
                ? "เก่าสุด"
                : selectedSortOption === "most_likes"
                ? "ยอดไลค์มากสุด"
                : selectedSortOption === "least_likes"
                ? "ยอดไลค์น้อยสุด"
                : selectedSortOption === "most_views"
                ? "ยอดวิวมากสุด"
                : selectedSortOption === "least_views"
                ? "ยอดวิวน้อยสุด"
                : "เรียงลำดับ"}
              <svg
                className={`w-5 h-5 transform transition-transform ${
                  isSortDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Button>

            {isSortDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                {[
                  {
                    label: "ใหม่สุด",
                    value: "newest",
                  },
                  {
                    label: "เก่าสุด",
                    value: "oldest",
                  },
                  {
                    label: "ยอดไลค์มากสุด",
                    value: "most_likes",
                  },
                  {
                    label: "ยอดไลค์น้อยสุด",
                    value: "least_likes",
                  },
                  {
                    label: "ยอดวิวมากสุด",
                    value: "most_views",
                  },
                  {
                    label: "ยอดวิวน้อยสุด",
                    value: "least_views",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    className={`block w-full text-left px-4 py-2 text-base font-medium transition-all ${
                      selectedSortOption === option.value
                        ? "bg-[#22c55e] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSelectedSortOption(option.value);
                      setIsSortDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Clear Buttons */}
          <Button
            className="!px-4 !py-2 !rounded-xl !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-base transition-all hover:!bg-gray-100"
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedFaculty([]);
              setSelectedTag([]);
              setSelectedSortOption("newest");
              setIsFacultyDropdownOpen(false);
              setIsTagPanelOpen(false);
              setIsSortDropdownOpen(false);
            }}
          >
            ล้าง
          </Button>
        </div>

        {/* Expanded Faculty Filter Area (green box) */}
        {isFacultyDropdownOpen && (
          <div className="w-full bg-[#E6F4EA] rounded-xl p-6 flex flex-wrap gap-3 items-center">
            {faculties.map((faculty) => (
              <Button
                key={faculty}
                className={`!px-5 !py-2 !rounded-full !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-base transition-all ${
                  selectedFaculty.includes(faculty) ||
                  (faculty === "ทุกคณะ" && selectedFaculty.length === 0)
                    ? "!bg-[#22c55e] !text-white !border-[#22c55e]"
                    : "hover:!bg-gray-100"
                }`}
                type="button"
                onClick={() => {
                  setSelectedFaculty((prevSelectedFaculties) => {
                    if (faculty === "ทุกคณะ") {
                      return [];
                    } else if (prevSelectedFaculties.includes(faculty)) {
                      return prevSelectedFaculties.filter((f) => f !== faculty);
                    } else {
                      return [...prevSelectedFaculties, faculty];
                    }
                  });
                }}
              >
                {faculty}
              </Button>
            ))}
          </div>
        )}

        {/* Expanded tag filter area (green box) */}
        {isTagPanelOpen && (
          <div className="w-full bg-[#E6F4EA] rounded-xl p-6 flex flex-wrap gap-3 items-center">
            <Button
              className={`!px-5 !py-2 !rounded-full !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-base transition-all ${
                selectedTag.length === 0
                  ? "!bg-[#22c55e] !text-white !border-[#22c55e]"
                  : "hover:!bg-gray-100"
              }`}
              type="button"
              onClick={() => setSelectedTag([])}
            >
              ทั้งหมด
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                className={`!px-5 !py-2 !rounded-full !bg-white !text-gray-700 !border-2 !border-gray-300 !font-medium !text-base transition-all ${
                  selectedTag.includes(tag)
                    ? "!bg-[#22c55e] !text-white !border-[#22c55e]"
                    : "hover:!bg-gray-100"
                }`}
                type="button"
                onClick={() => {
                  setSelectedTag((prevSelectedTags) => {
                    if (prevSelectedTags.includes(tag)) {
                      return prevSelectedTags.filter((t) => t !== tag);
                    } else {
                      return [...prevSelectedTags, tag];
                    }
                  });
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-8">
        {filteredAndSortedPosts.map((post) => (
          <Link href={`/forum/${post.id}`} key={post.id} className="block">
            <Card className="mb-2 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {post.title}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-2 text-lg">
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                      <Tag key={tag} className="!px-4 !py-2 !text-sm">
                        {tag}
                      </Tag>
                    ))}
                  </div>
                  <div className="flex items-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <ChatBubbleLeftIcon className="h-5 w-5" />
                      <span>{getReplyCount(post.id)} ความคิดเห็น</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handlePostLike(post.id);
                      }}
                      className="flex items-center gap-2 hover:text-[#22c55e] transition-colors"
                    >
                      <HeartIcon
                        className={`h-5 w-5 transition-transform hover:scale-110 ${
                          likedPosts.has(post.id)
                            ? "fill-[#22c55e] text-[#22c55e]"
                            : ""
                        }`}
                      />
                      <span>{post.likeCount} ถูกใจ</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <EyeIcon className="h-5 w-5" />
                      <span>{post.viewCount} ดู</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 min-w-[200px] justify-end">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-lg">
                      {post.author.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {post.author.faculty} • {post.author.major} ปี{" "}
                      {post.author.year}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden ring-2 ring-[#22c55e]">
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
      {filteredAndSortedPosts.length === 0 && (
        <Card className="text-center py-16 mt-8 border-2 border-gray-100">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            ไม่พบโพสต์ที่ค้นหา
          </h3>
          <p className="text-gray-500 text-lg">
            ลองค้นหาด้วยคำอื่นหรือล้างตัวกรอง
          </p>
        </Card>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsCreatePostOpen(true)}
        className="fixed bottom-8 right-8 bg-[#22c55e] text-white p-4 rounded-full shadow-lg hover:bg-[#16a34a] transition-all duration-300 hover:scale-110"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                สร้างกระทู้ใหม่
              </h2>
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
                  เลือกคณะ:
                </label>
                <select
                  value={newPost.faculty}
                  onChange={(e) =>
                    setNewPost({ ...newPost, faculty: e.target.value })
                  }
                  className="w-full border-2 border-[#22c55e] rounded-xl p-4 text-gray-700 focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
                >
                  {faculties.map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
                  เลือกหมวดหมู่:
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) =>
                    setNewPost({ ...newPost, category: e.target.value })
                  }
                  className="w-full border-2 border-[#22c55e] rounded-xl p-4 text-gray-700 focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
                  หัวข้อ:
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  placeholder="หัวข้อกระทู้"
                  className="w-full border-2 border-[#22c55e] rounded-xl p-4 text-gray-700 focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-lg">
                  เนื้อหา:
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  placeholder="เขียนรายละเอียด..."
                  className="w-full border-2 border-[#22c55e] rounded-xl p-4 text-gray-700 resize-none focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all"
                  rows={6}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setIsCreatePostOpen(false)}
                className="px-8 py-3 border-2 border-[#22c55e] text-[#22c55e] rounded-xl hover:bg-[#22c55e]/10 transition-all font-medium"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleCreatePost}
                className="px-8 py-3 bg-[#22c55e] text-white rounded-xl hover:bg-[#16a34a] transition-all font-medium"
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
