import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#191838] flex flex-col items-center justify-center">
      <div className="bg-[#18173a] border border-[#23224a] rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:shadow-[0_0_20px_#008cff]">
        {' '}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-3xl font-bold text-neutral-100">Landing Page</h1>
          <span className="px-3 py-1 bg-[#008cff33] text-[#008cff] text-sm font-semibold rounded-full">
            Coming Soon
          </span>
        </div>
        <Link
          href="/home"
          className="inline-block bg-[#008cff] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-[#0070ff] hover:scale-105 hover:shadow-[0_0_15px_#008cff55]"
        >
          Enter Kurakey
        </Link>
      </div>
    </div>
  );
}
