import client from './client';

export const good = (id: number) => client.post(`/api/posts/${id}/like`);

export const bad = (id: number) => client.delete(`/api/posts/${id}/like`);
