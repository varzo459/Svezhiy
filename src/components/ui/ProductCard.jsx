// src/components/ui/ProductCard.jsx
import { ShoppingCart } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border rounded-lg shadow-sm overflow-hidden bg-white hover:shadow-md transition p-4 flex flex-col">
      <img
        src={
          product.imageUrl ||
          "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={product.name}
        className="w-full h-40 object-cover rounded-md mb-3"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
        }}
      />
      <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
      <p className="text-green-600 font-bold text-xl mt-1">{product.price} ₽</p>

      <button
        onClick={() => onAddToCart(product)}
        className="mt-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-4 transition"
      >
        <ShoppingCart size={18} /> В корзину
      </button>
    </div>
  );
}
