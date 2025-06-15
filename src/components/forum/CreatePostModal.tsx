import { FACULTIES, CATEGORIES } from "@/constants/index";
import { NewPost } from "@/types/index";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  newPost: NewPost;
  setNewPost: (post: NewPost) => void;
  onCreatePost: () => void;
}

export const CreatePostModal = ({
  isOpen,
  onClose,
  newPost,
  setNewPost,
  onCreatePost,
}: CreatePostModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">สร้างกระทู้ใหม่</h2>
          <button
            onClick={onClose}
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
              {FACULTIES.map((faculty) => (
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
              {CATEGORIES.map((category) => (
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
            onClick={onClose}
            className="px-8 py-3 border-2 border-[#22c55e] text-[#22c55e] rounded-xl hover:bg-[#22c55e]/10 transition-all font-medium"
          >
            ยกเลิก
          </button>
          <button
            onClick={onCreatePost}
            className="px-8 py-3 bg-[#22c55e] text-white rounded-xl hover:bg-[#16a34a] transition-all font-medium"
          >
            โพสกระทู้
          </button>
        </div>
      </div>
    </div>
  );
};
