"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  EyeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import postsData from "@/data/posts.json";
import repliesDataRaw from "@/data/replies.json";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";

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

const repliesData = repliesDataRaw as RepliesData;

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;
  const [replyContent, setReplyContent] = useState("");
  const [likedPost, setLikedPost] = useState(false);
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  // Find the post
  const post = postsData.posts.find((p) => p.id === topicId);

  // Get replies for this post
  const [replies, setReplies] = useState<Reply[]>(
    repliesData.replies[topicId] || []
  );

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

  const handlePostLike = async () => {
    setLikedPost(!likedPost);
    // In a real app, you would update the post's like count in the database
    post.likeCount = likedPost ? post.likeCount - 1 : post.likeCount + 1;

    // Save updated post
    try {
      const updatedPosts = postsData.posts.map((p) =>
        p.id === post.id ? post : p
      );

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
      console.error("Error saving post like:", error);
    }
  };

  const handleReplyLike = async (replyId: string) => {
    setLikedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(replyId)) {
        newSet.delete(replyId);
      } else {
        newSet.add(replyId);
      }
      return newSet;
    });

    const updatedReplies = replies.map((reply) => {
      if (reply.id === replyId) {
        const isLiked = likedReplies.has(replyId);
        return {
          ...reply,
          likeCount: isLiked ? reply.likeCount - 1 : reply.likeCount + 1,
        };
      }
      return reply;
    });

    setReplies(updatedReplies);

    // Save updated replies
    try {
      const updatedRepliesData = {
        ...repliesData.replies,
        [topicId]: updatedReplies,
      };

      await fetch("/api/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "replies",
          data: updatedRepliesData,
        }),
      });
    } catch (error) {
      console.error("Error saving reply like:", error);
    }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const updatedReplies = [newReply, ...replies];
    setReplies(updatedReplies);
    setReplyContent("");

    // Save updated replies
    try {
      const updatedRepliesData = {
        ...repliesData.replies,
        [topicId]: updatedReplies,
      };

      await fetch("/api/forum", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "replies",
          data: updatedRepliesData,
        }),
      });
    } catch (error) {
      console.error("Error saving reply:", error);
    }
  };

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
              onClick={handlePostLike}
              className="flex items-center gap-1 hover:text-[#22c55e] transition-colors"
            >
              <HeartIcon
                className={`h-5 w-5 ${
                  likedPost ? "fill-[#22c55e] text-[#22c55e]" : ""
                }`}
              />
              <span>{post.likeCount} ถูกใจ</span>
            </button>
            <div className="flex items-center gap-1">
              <EyeIcon className="h-5 w-5" />
              <span>{post.viewCount} ดู</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-medium text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-500">
                {post.author.faculty} • {post.author.major} ปี{" "}
                {post.author.year}
              </p>
            </div>
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Reply Form Card */}
      <Card className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          แสดงความคิดเห็น
        </h2>
        <form onSubmit={handleSubmitReply}>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="แสดงความคิดเห็น..."
            className="w-full px-4 py-3 border-2 border-[#22c55e] rounded-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e] mb-4 resize-none min-h-[80px]"
            rows={4}
          />
          <div className="flex justify-end">
            <Button type="submit">ตอบกลับ</Button>
          </div>
        </form>
      </Card>

      {/* Replies List Card */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          ความคิดเห็น ({replies.length})
        </h2>
        {replies.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            ยังไม่มีความคิดเห็น
          </div>
        ) : (
          <div className="space-y-6">
            {replies.map((reply: Reply) => (
              <div
                key={reply.id}
                className="flex gap-4 border-b last:border-b-0 border-gray-100 pb-6 last:pb-0"
              >
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={reply.author.avatar}
                    alt={reply.author.name}
                    className="h-full w-full object-cover"
                  />
                </div>
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
                    onClick={() => handleReplyLike(reply.id)}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#22c55e] transition-colors"
                  >
                    <HeartIcon
                      className={`h-4 w-4 ${
                        likedReplies.has(reply.id)
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
