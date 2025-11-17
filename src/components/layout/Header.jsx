// src/components/layout/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext"; // Этот импорт должен быть правильным
import { FiShoppingCart, FiUser } from "react-icons/fi";
import { useState } from "react";

export default function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { getTotalItems } = useCart(); // Используем функцию из контекста
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="w-full bg-white shadow sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          Свежий
        </Link>

        {/* Desktop navigation */}
        <nav className="text-lg hidden md:flex gap-6 text-gray-800 font-medium">
          <Link to="/" className="hover:text-green-600">
            Главная
          </Link>

          {user && !isAdmin && (
            <>
              <Link to="/profile" className="hover:text-green-600">
                Профиль
              </Link>
              <Link to="/orders" className="hover:text-green-600">
                Мои заказы
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/orders" className="hover:text-green-600">
                Мои заказы
              </Link>
              <Link to="/admin/orders" className="hover:text-green-600">
                Все заказы
              </Link>
              <Link to="/admin/products" className="hover:text-green-600">
                Продукты
              </Link>
            </>
          )}
        </nav>

        {/* Icons & burger */}
        <div className="flex items-center gap-4 text-gray-800">
          <Link to="/cart" className="relative">
            <FiShoppingCart size={22} className="hover:text-green-600" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/profile" title="Профиль">
                <img
                  src={user.photoURL || "https://via.placeholder.com/40"}
                  alt="avatar"
                  className="w-9 h-9 rounded-full border"
                />
              </Link>
            </div>
          ) : (
            <Link to="/auth" className="hidden md:block">
              <FiUser size={22} className="hover:text-green-600" />
            </Link>
          )}

          {/* Mobile burger button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow px-6 py-4 space-y-3 text-gray-800 font-medium animate-slide-down">
          <Link to="/" className="block" onClick={() => setMenuOpen(false)}>
            В магазин
          </Link>

          {user && !isAdmin && (
            <>
              <Link
                to="/profile"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Профиль
              </Link>
              <Link
                to="/orders"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Мои заказы
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/orders"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Заказы
              </Link>
              <Link
                to="/admin/products"
                className="block"
                onClick={() => setMenuOpen(false)}
              >
                Продукты
              </Link>
            </>
          )}

          {user ? (
            <button onClick={handleLogout} className="text-red-600 block">
              Выйти
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setMenuOpen(false)}
              className="block"
            >
              Войти
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
