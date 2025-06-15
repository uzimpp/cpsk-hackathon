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

  // Aggressive data normalization for localPosts
  const normalizePosts = (data: any): Post[] => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    return data
      .flatMap((item) => {
        // If an item is an array, flatten it and try to parse its elements as posts
        if (Array.isArray(item)) {
          return item
            .map((subItem) => {
              // Only return valid Post-like objects, or filter out non-objects/malformed ones
              if (
                typeof subItem === "object" &&
                subItem !== null &&
                "id" in subItem &&
                "title" in subItem &&
                "content" in subItem
              ) {
                return subItem as Post;
              }
              return null;
            })
            .filter(Boolean) as Post[]; // Filter out nulls
        } else if (
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "title" in item &&
          "content" in item
        ) {
          // If an item is a direct Post-like object
          return item as Post;
        }
        return null;
      })
      .filter(Boolean) as Post[]; // Filter out any top-level nulls
  };

  const [localPosts, setLocalPosts] = useState<Post[]>(() =>
    normalizePosts(postsData.posts)
  );

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
      //console.log("useForum.ts: Filtering post:", post); // Removed previous log
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

  // Handle post like
  const handlePostLike = async (postId: string) => {
    const postToUpdate = localPosts.find((post) => post.id === postId);
    if (!postToUpdate) return;

    const isLiked = likedPosts.has(postId);
    const newLikeCount = Math.max(
      0,
      isLiked ? postToUpdate.likeCount - 1 : postToUpdate.likeCount + 1
    );

    // Optimistically update UI
    setLocalPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likeCount: newLikeCount } : post
      )
    );

    // Update liked state
    setLikedPosts((prev) => {
      const newSet = new Set(prev);
      if (isLiked) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });

    // Persist change to backend
    try {
      const response = await fetch("/api/forum", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "posts",
          data: { id: postId, likeCount: newLikeCount },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like count");
      }
    } catch (error) {
      console.error("Error updating like count:", error);
      // Revert optimistic update if API call fails
      setLocalPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likeCount: postToUpdate.likeCount }
            : post
        )
      );
      setLikedPosts((prev) => {
        const newSet = new Set(prev);
        if (isLiked) {
          newSet.add(postId);
        } else {
          newSet.delete(postId);
        }
        return newSet;
      });
    }
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
    handlePostLike,
    handleReplyLike,
    resetFilters,
  };
};
