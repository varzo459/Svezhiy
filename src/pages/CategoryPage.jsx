// src/pages/CategoryPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../services/firestore";
import BeautifulProductCard from "../components/ui/BeautifulProductCard"; // Новый импорт
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">
            {categoryTitles[id] || "Категория"}
          </h1>
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {categoryTitles[id] || "Категория"}
          </h1>
          <p className="text-xl text-gray-600">
            {products.length > 0
              ? `Найдено ${products.length} товаров`
              : "Товары в этой категории скоро появятся"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">😔</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Товаров пока нет
            </h3>
            <p className="text-gray-600 text-lg max-w-md mx-auto">
              В этой категории пока нет товаров. Скоро мы их добавим!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <BeautifulProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                showBadge={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
