import Footer from "./Footer";
import Navbar from "./Navbar";
import SearchFilters from "./SearchFilters/SearchFilters";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters />
      <div className="flex-1 bg-[#f4f4f0] ">{children}</div>
      <Footer />
    </div>
  );
}
