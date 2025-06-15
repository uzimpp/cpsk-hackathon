export interface Reply {
  id: string;
  content: string;
  author: Author;
  createdAt: string;
  likeCount: number;
}

export interface Author {
  id: string;
  name: string;
  faculty: string;
  major: string;
  year: string;
  avatar: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  replyCount?: number;
}

export interface RepliesData {
  replies: {
    [key: string]: Reply[];
  };
}

export interface NewPost {
  title: string;
  content: string;
  faculty: string;
  category: string[];
  tags: string[];
}
