import client from './client';

export const writeComment = (id: number, text: string) =>
  client.post(`/api/posts/${id}/comments`, {
    text,
  });

export const writeRecomment = (id: number, commentId: number, text: string) =>
  client.post(`/api/posts/${id}/comments/${commentId}/recomments`, {
    text,
  });

export const listComments = (id: number) => client.get(`/api/posts/${id}/comments`);

export const updateComment = (id: number, commentId: number, text: string) =>
  client.patch(`/api/posts/${id}/comments/${commentId}`, { text });

export const updateRecomment = (id: number, commentId: number, recommentId: number, text: string) =>
  client.patch(`/api/posts/${id}/comments/${commentId}/recomments/${recommentId}`, { text });

export const deleteComment = (id: number, commentId: number) => client.delete(`/api/posts/${id}/comments/${commentId}`);

export const deleteRecomment = (id: number, commentId: number, recommentId: number) =>
  client.delete(`/api/posts/${id}/comments/${commentId}/recomments/${recommentId}`);
