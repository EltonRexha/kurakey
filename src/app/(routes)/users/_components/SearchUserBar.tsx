'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';

const SearchUserBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState<string>(
    searchParams.get('username') || ''
  );
  const debouncedUsername = useDebounce(username, 500);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedUsername) params.set('username', debouncedUsername);
    router.push(`/users?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedUsername]);

  return (
    <div className="flex w-full mb-6">
      <input
        type="text"
        placeholder="Search users by username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="flex-1 px-3 py-2 rounded bg-[#11142d] text-white placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-emerald-500"
      />
    </div>
  );
};

export default SearchUserBar;
