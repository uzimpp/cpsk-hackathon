import { useState } from "react";
import { Post, Reply, RepliesData, NewPost } from "../types";
import postsData from "@/data/posts.json";
import repliesData from "@/data/replies.json";
import { FACULTIES } from "../constants";

export const useForum = () => {
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
  const [newPost, setNewPost] = useState<NewPost>({
    title: "",
    content: "",
    faculty: "คณะเกษตร",
    category: "การเรียน",
  });
  const [localPosts, setLocalPosts] = useState<Post[]>(postsData.posts);
  const [localReplies, setLocalReplies] = useState<RepliesData>(
    repliesData as RepliesData
  );
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedReplies, setLikedReplies] = useState<Set<string>>(new Set());

  // Get all unique tags from posts, excluding faculties
  const allTags = Array.from(
    new Set(localPosts.flatMap((post) => post.tags))
  ).filter((tag) => !FACULTIES.includes(tag));

  // Filter and sort posts
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

  // Create new post
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

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedFaculty([]);
    setSelectedTag([]);
    setSelectedSortOption("newest");
    setIsFacultyDropdownOpen(false);
    setIsTagPanelOpen(false);
    setIsSortDropdownOpen(false);
  };

  return {
    // State
    searchQuery,
    setSearchQuery,
    selectedTag,
    setSelectedTag,
    selectedFaculty,
    setSelectedFaculty,
    selectedCategory,
    setSelectedCategory,
    isFacultyDropdownOpen,
    setIsFacultyDropdownOpen,
    isCategoryDropdownOpen,
    setIsCategoryDropdownOpen,
    isCreatePostOpen,
    setIsCreatePostOpen,
    isTagPanelOpen,
    setIsTagPanelOpen,
    selectedSortOption,
    setSelectedSortOption,
    isSortDropdownOpen,
    setIsSortDropdownOpen,
    newPost,
    setNewPost,
    localPosts,
    setLocalPosts,
    localReplies,
    setLocalReplies,
    likedPosts,
    setLikedPosts,
    likedReplies,
    setLikedReplies,
    allTags,
    filteredAndSortedPosts,

    // Functions
    getReplyCount,
    handleCreatePost,
    handlePostLike,
    handleReplyLike,
    resetFilters,
  };
};
