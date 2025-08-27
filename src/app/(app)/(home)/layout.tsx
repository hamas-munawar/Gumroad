import Footer from "@/modules/home/ui/components/Footer";
import Navbar from "@/modules/home/ui/components/Navbar";
import SearchFiltersWrapper from "@/modules/home/ui/components/SearchFilters/SearchFiltersWrapper";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFiltersWrapper />
      <div className="flex-1 bg-[#f4f4f0] ">{children}</div>
      <Footer />
    </div>
  );
}
