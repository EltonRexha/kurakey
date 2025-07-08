import Footer from '@/components/ui/Footer';
import SimpleNavBar from '@/components/ui/SimpleNavBar';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-[#080c1c] min-h-screen flex flex-col">
            <SimpleNavBar />
            <div className="flex-grow">{children}</div>
            <Footer />
        </div>
    );
}
