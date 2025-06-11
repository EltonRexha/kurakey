import LogoutBtn from '@/components/LogoutBtn';
import { getServerSession } from 'next-auth';
import React from 'react';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const page = async () => {
  const session = await getServerSession(authOptions);
  const user = session?.user;

  if (!user) {
    return <h1>Something went wrong</h1>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
     
      <div className="mt-4">
        <LogoutBtn />
      </div>
    </div>
  );
};

export default page;
