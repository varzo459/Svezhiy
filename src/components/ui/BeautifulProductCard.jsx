// src/components/ui/BeautifulProductCard.jsx
import { ShoppingCart } from "lucide-react";

export default function BeautifulProductCard({
  product,
  onAddToCart,
  showBadge = false,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 group">
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={
            product.imageUrl ||
            "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          }
          alt={product.name}
          className="w-full h-48 object-cover transition duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
          }}
        />

        {/* Бейдж "Хит" */}
        {showBadge && (
          <div className="absolute top-3 right-3">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              Хит
            </span>
          </div>
        )}

        {/* Бейдж категории */}
        <div className="absolute top-3 left-3">
          <span className="bg-black/70 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Overlay при наведении */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300 rounded-t-2xl"></div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-800 text-lg mb-2 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-green-600">
            {product.price} ₽
          </span>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            за шт.
          </span>
        </div>

        <button
          onClick={() => onAddToCart(product)}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition duration-300 transform hover:scale-105 flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingCart
            size={18}
            className="transition-transform group-hover/btn:scale-110"
          />
          В корзину
        </button>
      </div>
    </div>
  );
}
