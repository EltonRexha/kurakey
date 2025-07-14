export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#080c1c] min-h-screen flex flex-col">
      <div className="flex-grow">{children}</div>
    </div>
  );
}
