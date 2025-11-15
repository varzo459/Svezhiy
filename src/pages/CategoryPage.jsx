// src/pages/CategoryPage.jsx (очищенная версия)
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../services/firestore";
import ProductCard from "../components/ui/ProductCard";
import { Loader } from "../components/ui/Loader";
import { useCart } from "../contexts/CartContext";

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const categoryMapping = {
    vegetables: "Овощи",
    fruits: "Фрукты",
    dairy: "Молочные продукты",
  };

  const categoryTitles = {
    vegetables: "Овощи",
    fruits: "Фрукты",
    dairy: "Молочные продукты",
  };

  useEffect(() => {
    async function load() {
      if (!id) return;

      const categoryFromUrl = categoryMapping[id];
      const data = await getProductsByCategory(categoryFromUrl);
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">
          {categoryTitles[id] || "Категория"}
        </h1>
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">
        {categoryTitles[id] || "Категория"}
      </h1>

      {products.length === 0 ? (
        <div className="text-gray-600 text-lg text-center py-10">
          Нет товаров в этой категории.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
