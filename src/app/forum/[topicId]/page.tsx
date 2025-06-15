"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useForum } from "@/hooks/useForum";
import { Reply } from "@/types";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const [replyContent, setReplyContent] = useState("");

  const {
    localPosts,
    localReplies,
    handlePostLike,
    handleReplyLike,
    likedPosts,
    setLocalReplies,
  } = useForum();

  // Find the post from localPosts
  const post = localPosts.find((p) => p.id === topicId);

  // Get replies for this post from localReplies
  const replies = (localReplies.replies[topicId] || []) as Reply[];

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ไม่พบกระทู้</h1>
          <p className="text-gray-600">กระทู้นี้อาจถูกลบหรือไม่เคยมีอยู่</p>
        </div>
      </div>
    );
  }

  const isPostLiked = likedPosts.has(post.id);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 px-4 py-2 border border-[#22c55e] text-[#22c55e] bg-white hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
        type="button"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>กลับ</span>
      </Button>

      {/* Main Post Card */}
      <Card className="mb-8">
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>{replies.length} ความคิดเห็น</span>
            </div>
            <button
              onClick={() => handlePostLike(post.id)}
              className="flex items-center gap-1 hover:text-[#22c55e] transition-colors"
            >
              <HeartIcon
                className={`h-5 w-5 ${
                  isPostLiked ? "fill-[#22c55e] text-[#22c55e]" : ""
                }`}
              />
              <span>{post.likeCount} ถูกใจ</span>
            </button>
            <div className="flex items-center gap-1">
              <EyeIcon className="h-5 w-5" />
              <span>{post.viewCount} ดู</span>
            </div>
          </div>

          {/* Author info */}
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="text-sm">
              <span className="font-medium text-gray-900">
                {post.author.name}
              </span>
              <div className="text-gray-500">
                {post.author.faculty} • {post.author.major} ปี{" "}
                {post.author.year}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Reply Section */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ความคิดเห็น</h2>

        {/* Reply Input */}
        <div className="mb-8">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="เขียนความคิดเห็น..."
            className="w-full border-2 border-[#22c55e] rounded-xl p-4 text-gray-700 resize-none focus:ring-4 focus:ring-[#22c55e]/20 focus:border-[#22c55e] transition-all mb-4"
            rows={4}
          />
          <div className="flex justify-end">
            <Button
              onClick={async () => {
                if (!replyContent.trim()) return;
                // Mock user for reply (replace with real user if available)
                const mockUser = {
                  id: "6400000000",
                  name: "ผู้ใช้ใหม่",
                  faculty: "วิศวกรรมศาสตร์",
                  major: "วิศวกรรมคอมพิวเตอร์",
                  year: "1",
                  avatar: "/avatars/noprofilepic.png",
                };
                const newReply: Reply = {
                  id: Date.now().toString(),
                  content: replyContent,
                  author: mockUser,
                  createdAt: new Date().toISOString(),
                  likeCount: 0,
                };

                // Optimistically add reply locally
                setLocalReplies((prev) => ({
                  replies: {
                    ...prev.replies,
                    [topicId]: [...(prev.replies[topicId] || []), newReply],
                  },
                }));
                setReplyContent("");

                // Persist reply to backend using POST
                try {
                  const response = await fetch("/api/forum", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      type: "replies",
                      data: { postId: topicId, reply: newReply }, // Send postId and the new reply
                    }),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to save reply");
                  }
                } catch (error) {
                  console.error("Error saving reply:", error);
                  // Revert optimistic update if API call fails (optional, depends on desired UX)
                  setLocalReplies((prev) => ({
                    replies: {
                      ...prev.replies,
                      [topicId]: (prev.replies[topicId] || []).filter(
                        (r) => r.id !== newReply.id
                      ),
                    },
                  }));
                }
              }}
              className="!px-6 !py-3 !rounded-xl !text-lg !font-semibold !bg-[#22c55e] !text-white hover:!bg-[#16a34a] transition-all duration-300"
              type="button"
            >
              ส่งความคิดเห็น
            </Button>
          </div>
        </div>

        {/* Replies List */}
        {replies.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            ยังไม่มีความคิดเห็น
          </p>
        ) : (
          <div className="space-y-6">
            {replies.map((reply) => (
              <div key={reply.id} className="flex items-start gap-4">
                <img
                  src={reply.author.avatar}
                  alt={reply.author.name}
                  className="w-9 h-9 rounded-full mt-1"
                />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <span className="font-medium text-gray-900">
                      {reply.author.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {reply.author.faculty} • {reply.author.major} ปี{" "}
                      {reply.author.year}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                    {reply.content}
                  </p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleReplyLike(topicId, reply.id);
                    }}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#22c55e] transition-colors"
                  >
                    <HeartIcon
                      className={`h-4 w-4 ${
                        likedPosts.has(reply.id)
                          ? "fill-[#22c55e] text-[#22c55e]"
                          : ""
                      }`}
                    />
                    <span>{reply.likeCount} ถูกใจ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
