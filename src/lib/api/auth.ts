import client from './client';

export type UserState = {
  username: string;
  workoutDays: number;
  profileImage: string;
  email: string;
  loginType: string;
};

export type LoginData = { username: string; email: string; profileImage: string };

export const login = (data: LoginData) => client.post<UserState>('/api/auth/login', data);

export const check = () => client.get<UserState>('/api/auth/check');

export const logout = () => client.post('/api/auth/logout');

export const update = (formData: FormData) =>
  client.patch('/api/auth/user', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const leave = () => client.delete('/api/auth/user');
