import LogoutBtn from '@/components/LogoutBtn';
import React from 'react';

const page = async () => {
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
