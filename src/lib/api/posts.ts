import qs from 'querystring';
import client from './client';
import { UserState } from './auth';
import { Comment } from './comments';

export const writePost = (formData: FormData) =>
  client.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export type Post = {
  id: number;
  isPrivate: boolean;
  title: string;
  body: string;
  files: string[];
  tags: string[];
  likeUsers: UserState[];
  likes: number;
  comments: Comment[];
  user: UserState;
  publishedDate: Date;
};

export const readPost = (id: number) => client.get<Post>(`/api/posts/${id}`);

type ListPostsData = { page: number; username: string; email: string; tag: string };

export const listPosts = (data: ListPostsData) => {
  const querystring = qs.stringify(data);
  return client.get<Post[]>(`/api/posts?${querystring}`);
};

export const updatePost = (id: number, formData: FormData) =>
  client.patch<Post>(`/api/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const removePost = (id: number) => client.delete(`/api/posts/${id}`);
