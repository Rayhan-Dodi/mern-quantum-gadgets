import { useParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const { products } = useProductStore();
  const { user } = useUserStore();
  const { addToCart } = useCartStore();

  // Find the product from your store (adjust if you fetch by id)
  const product = products.find((p) => p._id === id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add products to cart", { id: "login" });
      return;
    }
    addToCart(product);
    toast.success("Added to cart!", { id: "added" });
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-300">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p>Sorry, we couldn&#39;t find that product.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 py-8 bg-gray-900 rounded-lg shadow-lg text-white">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-80 h-80 object-contain rounded"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="mb-4 text-lg text-gray-400">{product.description}</p>
          <div className="mb-6">
            <span className="text-2xl font-bold text-blue-400">
              ৳ {product.price}
            </span>
          </div>
          <button
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white text-lg font-semibold hover:bg-blue-700 transition"
            onClick={handleAddToCart}
          >
            <ShoppingCart size={22} />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
