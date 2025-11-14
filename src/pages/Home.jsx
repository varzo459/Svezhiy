// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getAllProducts } from "../services/firestore";
import ProductCard from "../components/ui/ProductCard";
import { CategoryCard } from "../components/ui/CategoryCard";
import { Loader } from "../components/ui/Loader";
import { useCart } from "../contexts/CartContext"; // Добавьте этот импорт

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart(); // Получаем функцию добавления в корзину

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.warn("Failed to load products:", err);
        setError(
          "Не удалось загрузить продукты. Проверьте подключение к интернету."
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-20">
      <h1 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
        Все продукты
      </h1>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}

      {loading ? (
        <Loader />
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

      <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-4">Категории</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CategoryCard
          title="Овощи"
          image="https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          to="/category/vegetables"
        />
        <CategoryCard
          title="Фрукты"
          image="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          to="/category/fruits"
        />
        <CategoryCard
          title="Молочные продукты"
          image="https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
          to="/category/dairy"
        />
      </div>
    </div>
  );
}
