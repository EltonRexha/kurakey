import { z } from 'zod';

export const OAuthUserSchema = z.object({
  email: z.string().email().nonempty('Email is required'),
  firstName: z
    .string()
    .nonempty('First Name is required')
    .max(20, 'First name is too long')
    .min(3, 'First name is too short')
    .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .max(20, 'Last name is too long')
    .min(3, 'Last name is too short')
    .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters')
    .optional(),
  username: z
    .string()
    .min(6, 'Username must be at least 6 characters long')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscore'
    )
    .regex(/^\S*$/, 'Username cannot contain spaces'),
  image: z.string().url('Image must be a valid URL').optional(),
});
