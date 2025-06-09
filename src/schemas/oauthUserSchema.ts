import { z } from 'zod';

export const OAuthUserSchema = z.object({
  email: z.string().email().nonempty('Email is required'),
  firstName: z
    .string()
    .nonempty('First Name is required')
    .max(20)
    .min(3)
    .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .nonempty('Last Name is required')
    .max(20)
    .min(3)
    .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters'),
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
