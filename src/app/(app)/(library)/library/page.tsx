import Footer from "./Footer";
import Navbar from "./Navbar";
import ProductsList from "./ProductsList";

const LibraryPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <header className="bg-[#f4f4f0] font-medium px-4 lg:px-20 py-4">
        <h4 className="font-medium text-3xl">Library</h4>
        <p className="text-sm text-muted-foreground">
          Items you have purchased will appear here.
        </p>
      </header>
      <div className="flex-1 px-4 lg:px-20 py-4">
        <ProductsList />
      </div>
      <Footer />
    </div>
  );
};

export default LibraryPage;
