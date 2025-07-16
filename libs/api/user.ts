import { UserSchema } from '@/schemas/userSchema';
import { z } from 'zod';
import axios from '../axios';

type User = z.infer<typeof UserSchema>;

interface CreatedUserResponse {
  message: string;
  email: string;
}

export async function createUser(user: User): Promise<CreatedUserResponse> {
  const parsedUser = UserSchema.parse(user);

  const response = await axios.post<CreatedUserResponse>('/users', parsedUser);
  return response.data;
}

interface PaginatedUsersResponse {
  users: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string | null;
  }[];
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    limit: number;
  };
}

interface SearchParams extends Record<string, string | number | undefined> {
  username?: string;
  id?: string;
  email?: string;
  page?: number;
  limit?: number;
}

export async function updateProfileImage(
  image: string
): Promise<{ message: string; user: { id: string; image: string } }> {
  const response = await axios.patch<{
    message: string;
    user: { id: string; image: string };
  }>('/user', { image });
  return response.data;
}

export async function findUser(
  search: SearchParams
): Promise<PaginatedUsersResponse> {
  const params = new URLSearchParams();

  Object.entries(search).forEach(([key, value]) => {
    if (value) params.append(key, value.toString());
  });

  const response = await axios.get<PaginatedUsersResponse>(
    `/users?${params.toString()}`
  );
  return response.data;
}
