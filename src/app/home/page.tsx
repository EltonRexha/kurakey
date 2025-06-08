import LogoutBtn from '@/components/LogoutBtn';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {
  const session = await getServerSession();
  const user = session?.user;

  if (!user) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <div>
      <p>Hello {user.name}</p>
      <LogoutBtn />
    </div>
  );
};

export default page;
