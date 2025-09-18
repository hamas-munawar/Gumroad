import Footer from "./Footer";
import Navbar from "./Navbar";

export default async function HomeLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ tenantSlug: string }>;
  children: React.ReactNode;
}>) {
  const { tenantSlug } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar tenantSlug={tenantSlug} />
      <div className="flex-1 px-4 lg:px-20 bg-[#f4f4f0]">{children}</div>
      <Footer />
    </div>
  );
}
