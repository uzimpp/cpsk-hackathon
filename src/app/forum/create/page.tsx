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
    category: [],
    tags: [],
  });
  const [newTagInput, setNewTagInput] = useState("");
  const [newCategoryInput, setNewCategoryInput] = useState("");

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

  const handleAddCategoryFromInput = () => {
    const categoryToAdd = newCategoryInput.trim();
    if (categoryToAdd && !newPost.category.includes(categoryToAdd)) {
      setNewPost({
        ...newPost,
        category: [...newPost.category, categoryToAdd],
      });
      setNewCategoryInput("");
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setNewPost({
      ...newPost,
      category: newPost.category.filter((cat) => cat !== categoryToRemove),
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
          major: newPost.category[0] || "",
          year: "1",
          avatar: "/avatar4.jpg",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: [...newPost.tags, ...newPost.category],
        viewCount: 1,
        likeCount: 0,
      };

      console.log("New Post:", post);

      try {
        const response = await fetch("/api/forum", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "posts",
            data: post,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to save post");
        }

        router.push("/forum");
      } catch (error) {
        console.error("Error saving post:", error);
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

          {/* Category Selection with multi-select and add functionality */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-lg">
              เลือกหมวดหมู่:
            </label>
            <div className="w-full bg-[#E6F4EA] rounded-xl p-4 flex flex-wrap gap-2 border-2 border-[#22c55e]">
              {[...new Set([...CATEGORIES, ...newPost.category])].map(
                (category) => {
                  const isSelected = newPost.category.includes(category);
                  const isPredefined = CATEGORIES.includes(category);

                  return (
                    <Button
                      key={category}
                      className={`!px-5 !py-2 !rounded-full !font-medium !text-base transition-all flex items-center gap-2 ${
                        isSelected
                          ? "!bg-[#22c55e] !text-white !border-[#22c55e]"
                          : "!bg-white !text-gray-700 !border-2 !border-gray-300 hover:!bg-gray-100"
                      }`}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveCategory(category);
                        } else {
                          setNewPost({
                            ...newPost,
                            category: [...newPost.category, category],
                          });
                        }
                      }}
                    >
                      {category}
                      {isSelected && !isPredefined && (
                        <svg
                          className="w-4 h-4 ml-1"
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
                      )}
                    </Button>
                  );
                }
              )}

              <input
                type="text"
                placeholder="เพิ่มหมวดหมู่ใหม่"
                className="px-4 py-2 border-2 border-gray-300 rounded-full text-base focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all flex-1 min-w-[100px] outline-none bg-transparent placeholder-gray-400"
                value={newCategoryInput}
                onChange={(e) => setNewCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCategoryFromInput();
                  }
                }}
              />
              <Button
                className="!px-4 !py-2 !rounded-full !bg-[#22c55e] !text-white hover:!bg-[#16a34a] transition-all"
                type="button"
                onClick={handleAddCategoryFromInput}
              >
                +
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

        <div className="mt-8 flex justify-end">
          <Button
            type="button"
            onClick={handleCreatePost}
            className="!px-8 !py-4 !rounded-xl !text-xl !font-semibold !bg-[#22c55e] !text-white hover:!bg-[#16a34a] transition-all duration-300"
          >
            สร้างโพสต์
          </Button>
        </div>
      </Card>
    </div>
  );
}
