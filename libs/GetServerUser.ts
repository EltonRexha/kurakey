import { getServerSession } from 'next-auth';
import prisma from '../prisma/prisma';

export default async function GetServerUser() {
  const session = await getServerSession();

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
