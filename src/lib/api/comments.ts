import client from './client';
import { UserState } from './auth';
import { Post } from './posts';

export type CommonComment = {
  id: number;
  publishedDate: Date;
  text: string;
  isEdited: boolean;
  user: UserState;
};

export type Comment = CommonComment & {
  recomments: CommonComment[];
};

export type ReComment = CommonComment;

export const writeComment = (id: number, text: string) =>
  client.post(`/api/posts/${id}/comments`, {
    text,
  });

export const writeReComment = (id: number, commentId: number, text: string) =>
  client.post(`/api/posts/${id}/comments/${commentId}/recomments`, {
    text,
  });

export const listComments = (id: number) => client.get<Comment[]>(`/api/posts/${id}/comments`);

export const updateComment = (id: number, commentId: number, text: string) =>
  client.patch(`/api/posts/${id}/comments/${commentId}`, { text });

export const updateReComment = (id: number, commentId: number, recommentId: number, text: string) =>
  client.patch(`/api/posts/${id}/comments/${commentId}/recomments/${recommentId}`, { text });

export const deleteComment = (id: number, commentId: number) =>
  client.delete<Post>(`/api/posts/${id}/comments/${commentId}`);

export const deleteRecomment = (id: number, commentId: number, recommentId: number) =>
  client.delete(`/api/posts/${id}/comments/${commentId}/recomments/${recommentId}`);
