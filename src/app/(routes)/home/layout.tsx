import Navbar from '@/components/ui/Navbar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#080c1c] min-h-screen">
      <Navbar/>
      <div>{children}</div>
    </div>
  );
}
