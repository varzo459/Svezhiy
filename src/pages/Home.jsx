// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllProducts } from "../services/firestore";
import BeautifulProductCard from "../components/ui/BeautifulProductCard";
import { CategoryCard } from "../components/ui/CategoryCard";
import { Loader } from "../components/ui/Loader";
import { useCart } from "../contexts/CartContext";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setError(null);
        const data = await getAllProducts();
        setProducts(data);

        // Выбираем 4 случайных товара для featured section
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (err) {
        console.warn("Failed to load products:", err);
        setError(
          "Не удалось загрузить продукты. Проверьте подключение к интернету."
        );
        setProducts([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Свежие продукты
            <span className="block text-green-200 text-3xl md:text-4xl mt-2">
              прямо к вашему дому!
            </span>
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() =>
                document
                  .getElementById("categories")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Начать покупки
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("products")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Все товары
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Быстрая доставка
              </h3>
              <p className="text-gray-600">
                Доставляем в течение 2 часов по всему городу
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Натуральные продукты
              </h3>
              <p className="text-gray-600">
                Только свежие и качественные товары от проверенных поставщиков
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💚</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Лучшие цены
              </h3>
              <p className="text-gray-600">
                Конкурентные цены без наценок посредников
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-white to-green-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                Популярные товары
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Самые востребованные продукты наших покупателей
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <BeautifulProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  showBadge={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section id="categories" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Категории товаров
            </h2>
            <p className="text-xl text-gray-600">
              Выберите интересующую вас категорию
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CategoryCard
              title="Овощи"
              description="Свежие и натуральные овощи"
              image="https://kuban.bfm.ru/storage/article/June2025/Bc24Uu3EHtA10g2FJ9sloto5o9lRQNMcf04SJ5DY.jpg"
              to="/category/vegetables"
              gradient="from-green-500 to-green-600"
            />
            <CategoryCard
              title="Фрукты"
              description="Сочные и спелые фрукты"
              image="https://img.freepik.com/premium-photo/assortment-delicious-fresh-fruit_23-2148595050.jpg?w=2000"
              to="/category/fruits"
              gradient="from-orange-500 to-orange-600"
            />
            <CategoryCard
              title="Молочные продукты"
              description="Качественные молочные продукты"
              image="https://avatars.mds.yandex.net/i?id=b960614462c1f2bca9bb8c76185aea98_l-7886515-images-thumbs&n=13"
              to="/category/dairy"
              gradient="from-blue-500 to-blue-600"
            />
          </div>
        </div>
      </section>

      {/* All Products Section */}
      <section
        id="products"
        className="py-16 bg-gradient-to-b from-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Все продукты
            </h2>
            <p className="text-xl text-gray-600">
              Полный ассортимент наших товаров
            </p>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8 text-center">
              <p className="text-yellow-800 text-lg">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              {products.length > 0 ? (
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
              ) : (
                <div className="text-center py-20">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">😔</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Товаров пока нет
                  </h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">
                    Скоро мы добавим новые продукты. Следите за обновлениями!
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Готовы сделать заказ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Присоединяйтесь к тысячам довольных клиентов, которые уже оценили
            качество наших продуктов и сервиса
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/category/vegetables")}
              className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105"
            >
              Сделать первый заказ
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("categories")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
            >
              Посмотреть категории
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
