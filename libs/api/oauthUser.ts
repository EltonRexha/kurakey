import { OAuthUserSchema } from '@/schemas/oauthUserSchema';
import { z } from 'zod';
import axios from '../axios';

type User = z.infer<typeof OAuthUserSchema>;

interface CreatedUserResponse {
  message: string;
  email: string;
}

export async function createOAuthUser(
  user: User
): Promise<CreatedUserResponse> {
  const parsedUser = OAuthUserSchema.parse(user);

  const response = await axios.post<CreatedUserResponse>('/OAuth', parsedUser);
  return response.data;
}
