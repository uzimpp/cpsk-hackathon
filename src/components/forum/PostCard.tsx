import Link from "next/link";
import {
  ChatBubbleLeftIcon,
  HeartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Card from "@/components/ui/Card";
import Tag from "@/components/ui/Tag";
import { getProfilePicUrl } from "@/utils/GetProfilePic";
import { Post } from "@/types/index";

interface PostCardProps {
  post: Post;
  replyCount: number;
  isLiked: boolean;
  onLike: (postId: string) => void;
}

export const PostCard = ({
  post,
  replyCount,
  isLiked,
  onLike,
}: PostCardProps) => {
  return (
    <Link href={`/forum/${post.id}`} className="block">
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
              {post.tags.map((tag: string) => (
                <Tag key={tag} className="!px-4 !py-2 !text-sm">
                  {tag}
                </Tag>
              ))}
            </div>
            <div className="flex items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <ChatBubbleLeftIcon className="h-5 w-5" />
                <span>{replyCount} ความคิดเห็น</span>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onLike(post.id);
                }}
                className="flex items-center gap-2 hover:text-[#22c55e] transition-colors"
              >
                <HeartIcon
                  className={`h-5 w-5 transition-transform hover:scale-110 ${
                    isLiked ? "fill-[#22c55e] text-[#22c55e]" : ""
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
  );
};
