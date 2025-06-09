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
  console.log('Full session:', session);
  console.log('User data:', user);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome!</h1>
      <div className="space-y-2">
        <p>Email: {user.email}</p>
        <p>Name: {user.name}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Username: {user.username}</p>
        {user.image && (
          <div className="mt-4">
            <p>Profile Image:</p>
            <img
              src={user.image}
              alt="Profile"
              className="w-20 h-20 rounded-full"
            />
          </div>
        )}
      </div>
      <div className="mt-4">
        <LogoutBtn />
      </div>
    </div>
  );
};

export default page;
