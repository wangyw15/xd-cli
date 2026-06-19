export type CDNPath = {
  url: string;
  rate: number;
};

export type Forum = {
  id: string;
  sort: string;
  name: string;
  status: string;
  forums: ForumInfo[];
};

export type ForumInfo = {
  id: string;
  fgroup?: string;
  sort?: string;
  name: string;
  showName?: string;
  msg: string;
  interval?: string;
  safe_mode?: string;
  auto_delete?: string;
  thread_count?: string;
  permission_level?: string;
  forum_fuse_id?: string;
  createdAt?: string;
  updateAt?: string;
  status?: string;
};

export type Timeline = {
  id: number;
  name: string;
  display_name: string;
  notice: string;
  max_page: number;
};

export type ThreadBase = {
  id: number;
  fid?: number;
  ReplyCount?: number;
  img: string;
  ext: string;
  now: string;
  user_hash: string;
  name: string;
  title: string;
  content: string;
  sage?: number;
  admin: number;
  Hide?: number;
};

export type ForumThread = ThreadBase & {
  Replies: ThreadBase[];
  RemainReplies: number;
};

export type ThreadReply = {
  id: number;
  user_hash: string;
  admin: number;
  title: string;
  now: string;
  content: string;
  img: string;
  ext: string;
  name: string;
};

export type Thread = ThreadBase & {
  Replies: ThreadReply[];
};

export type Ref = {
  id: number;
  img: string;
  ext: string;
  now: string;
  user_hash: string;
  name: string;
  title: string;
  content: string;
  sage: number;
  status: string;
  Hide: number;
  admin: number;
};

export type FeedThread = {
  id: string;
  user_id: string;
  fid: string;
  reply_count: string;
  recent_replies: string;
  category: string;
  file_id: string;
  img: string;
  ext: string;
  now: string;
  user_hash: string;
  name: string;
  email: string;
  title: string;
  content: string;
  status: string;
  admin: string;
  hide: string;
  po: string;
};

export type LastPost = {
  id: number;
  resto: number;
  now: string;
  user_hash: string;
  name: string;
  email: string;
  title: string;
  content: string;
  sage: number;
  admin: number;
};

export type Notice = {
  content: string;
  date: number;
  enable: boolean;
};

export type PostThreadOptions = {
  name?: string;
  title?: string;
  content: string;
  fid: number;
  image?: Blob;
  water?: boolean;
};

export type ReplyThreadOptions = {
  name?: string;
  title?: string;
  content: string;
  resto: number;
  image?: Blob;
  water?: boolean;
};

export type FailResponse = {
  success: boolean;
  error: string;
};

export type AddFeedResult = string;

export type DelFeedResult = string;
