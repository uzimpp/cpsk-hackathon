"use client";

import Card from "@/components/ui/Card";
import { useForum } from "@/hooks/useForum";
import { PostCard } from "@/components/forum/PostCard";
import { FilterBar } from "@/components/forum/FilterBar";
import { CreatePostModal } from "@/components/forum/CreatePostModal";
import { Post } from "@/types";

export default function Forum() {
  const {
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
  } = useForum();

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
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        isFacultyDropdownOpen={isFacultyDropdownOpen}
        setIsFacultyDropdownOpen={setIsFacultyDropdownOpen}
        isTagPanelOpen={isTagPanelOpen}
        setIsTagPanelOpen={setIsTagPanelOpen}
        selectedSortOption={selectedSortOption}
        setSelectedSortOption={setSelectedSortOption}
        isSortDropdownOpen={isSortDropdownOpen}
        setIsSortDropdownOpen={setIsSortDropdownOpen}
        allTags={allTags}
        resetFilters={resetFilters}
      />

      {/* Posts List */}
      <div className="space-y-8">
        {filteredAndSortedPosts.map((post: Post) => (
          <PostCard
            key={post.id}
            post={post}
            replyCount={getReplyCount(post.id)}
            isLiked={likedPosts.has(post.id)}
            onLike={handlePostLike}
          />
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
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        newPost={newPost}
        setNewPost={setNewPost}
        onCreatePost={handleCreatePost}
      />
    </div>
  );
}
