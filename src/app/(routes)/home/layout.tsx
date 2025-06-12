import Navbar from '@/components/ui/Navbar';
import { getServerSession } from 'next-auth';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <div className="bg-[#080c1c] min-h-screen">
      <Navbar profileImageUrl={session?.user.image} />
      <div>{children}</div>
    </div>
  );
}
