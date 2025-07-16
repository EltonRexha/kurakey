import { getServerSession } from 'next-auth';
import prisma from '../prisma/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export default async function GetServerUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  return user;
}
