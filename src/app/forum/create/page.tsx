"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FACULTIES, CATEGORIES } from "@/constants";
import { NewPost, Post } from "@/types";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function CreatePostPage() {
  const router = useRouter();
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    faculty: "ทุกคณะ",
    category: "",
    tags: [],
  });
  const [newTagInput, setNewTagInput] = useState("");

  const handleAddTagFromInput = () => {
    const tagToAdd = newTagInput.trim();
    if (tagToAdd && !newPost.tags.includes(tagToAdd)) {
      setNewPost({ ...newPost, tags: [...newPost.tags, tagToAdd] });
      setNewTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter((tag) => tag !== tagToRemove),
    });
  };

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
        tags: [...newPost.tags, newPost.category],
        viewCount: 1,
        likeCount: 0,
      };

      // For now, we'll just log the new post and navigate back.
      // In a real application, you'd send this to your backend.
      console.log("New Post:", post);

      // Simulate saving to local storage (if applicable, otherwise remove)
      // This part would depend on how your postsData is managed.
      // For now, we'll just navigate back.

      try {
        const response = await fetch("/api/forum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "posts",
            data: post, // Sending only the new post, not the whole updatedPosts array
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save post");
        }

        // Optionally, if you want to refresh the forum page data after creation
        // You might need to refetch posts on the main forum page or use a global state management.

        router.push("/forum"); // Navigate back to the forum page
      } catch (error) {
        console.error("Error saving post:", error);
        // Handle error, maybe show an alert to the user
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          สร้างกระทู้ใหม่
        </h1>

        <div className="space-y-6">
          {/* Faculty Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              เลือกคณะ:
            </label>
            <div className="w-full bg-[#E6F4EA] rounded-xl p-4 flex flex-wrap gap-2">
              {FACULTIES.map((faculty) => (
                <Button
                  key={faculty}
                  className={`!px-5 !py-2 !rounded-full !font-medium !text-base transition-all ${
                    newPost.faculty === faculty
                      ? "!bg-[#22c55e] !text-white !border-[#22c55e]"
                      : "!bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100"
                  }`}
                  type="button"
                  onClick={() => setNewPost({ ...newPost, faculty: faculty })}
                >
                  {faculty}
                </Button>
              ))}
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              เลือกหมวดหมู่:
            </label>
            <div className="w-full bg-[#E6F4EA] rounded-xl p-4 flex flex-wrap gap-2">
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  className={`!px-5 !py-2 !rounded-full !font-medium !text-base transition-all ${
                    newPost.category === category
                      ? "!bg-[#22c55e] !text-white !border-[#22c55e]"
                      : "!bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100"
                  }`}
                  type="button"
                  onClick={() => setNewPost({ ...newPost, category: category })}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Tags Input */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              แท็ก (Optional):
            </label>
            <div className="w-full border-2 border-[#22c55e] rounded-xl p-4 text-gray-700 focus-within:ring-4 focus-within:ring-[#22c55e]/20 focus-within:border-[#22c55e] transition-all flex flex-wrap items-center gap-2">
              {newPost.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center bg-[#D1FAE5] text-[#059669] px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-[#059669] hover:text-[#047857]"
                  >
                    <svg
                      className="w-4 h-4"
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
                </span>
              ))}
              <input
                type="text"
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTagFromInput();
                  }
                }}
                placeholder="เพิ่มแท็กใหม่ (เช่น: โปรเจค, AI)"
                className="flex-1 min-w-[100px] outline-none bg-transparent placeholder-gray-400"
              />
              <Button
                type="button"
                onClick={handleAddTagFromInput}
                className="!px-4 !py-2 !rounded-full !bg-[#22c55e] !text-white hover:!bg-[#16a34a] transition-all"
              >
                เพิ่ม
              </Button>
            </div>
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
          <Button
            onClick={() => router.push("/forum")}
            className="px-8 py-3 border-2 border-[#22c55e] text-[#22c55e] rounded-xl hover:bg-[#22c55e]/10 transition-all font-medium"
          >
            ยกเลิก
          </Button>
          <Button
            onClick={handleCreatePost}
            className="px-8 py-3 bg-[#22c55e] text-white rounded-xl hover:bg-[#16a34a] transition-all font-medium"
          >
            โพสกระทู้
          </Button>
        </div>
      </Card>
    </div>
  );
}
