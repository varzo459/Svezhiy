// src/pages/Profile.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">Профиль</h1>

      <div className="bg-white border rounded-xl shadow-sm p-6 flex flex-col items-center gap-4">
        <img
          src={user.photoURL || "https://placehold.co/100x100"}
          alt="Аватарка"
          className="w-28 h-28 rounded-full object-cover border"
        />

        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800">
            {user.displayName}
          </p>
          <p className="text-gray-600">{user.email}</p>
        </div>

        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
        >
          Мои заказы
        </button>

        <button
          onClick={logout}
          className="w-full border border-red-500 text-red-500 hover:bg-red-50 py-2 rounded-lg font-medium transition"
        >
          Выйти
        </button>
      </div>
    </div>
  );
}
