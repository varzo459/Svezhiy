// src/pages/CategoryPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../services/firestore";
import ProductCard from "../components/ui/ProductCard";
import { Loader } from "../components/ui/Loader";
import { useCart } from "../contexts/CartContext"; // Добавьте этот импорт

export default function CategoryPage() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // Получаем функцию добавления в корзину

  const categoryTitles = {
    vegetables: "Овощи",
    fruits: "Фрукты",
    dairy: "Молочные продукты",
  };

  useEffect(() => {
    async function load() {
      const data = await getProductsByCategory(id);
      setProducts(data);
      setLoading(false);
    }
    load();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        {categoryTitles[id] || "Категория"}
      </h1>

      {loading ? (
        <Loader />
      ) : products.length === 0 ? (
        <div className="text-gray-600 text-lg">
          Нет товаров в этой категории.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)} // Передаем функцию
            />
          ))}
        </div>
      )}
    </div>
  );
}
