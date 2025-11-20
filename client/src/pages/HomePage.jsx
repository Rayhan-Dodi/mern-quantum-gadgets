import { useEffect } from "react";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const HomePage = () => {
  const { fetchFeaturedProducts, products, isLoading } = useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-blue-400 mb-4">
          QuantumGadgets
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
         Explore next-gen tech gadgets — from drones to earbuds, gaming gear to smart accessories — all in one place at QuantumGadgets.
        </p>

        {!isLoading && products.length > 0 && (
          <FeaturedProducts featuredProducts={products} />
        )}
      </div>
      
    </div>
    
  );
};

export default HomePage;
