// src/pages/Cart.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { createOrder } from "../services/firestore";
import { useState } from "react";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } =
    useCart();

  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [address, setAddress] = useState("");

  const increaseQuantity = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity + 1);
    }
  };

  const decreaseQuantity = (id) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      updateQuantity(id, item.quantity - 1);
    }
  };

  async function handleCheckout() {
    if (!user) return navigate("/auth");

    if (cart.length === 0) {
      alert("Корзина пуста!");
      return;
    }

    if (!address.trim()) {
      alert("Пожалуйста, укажите адрес доставки");
      return;
    }

    setCheckoutLoading(true);
    try {
      await createOrder(user.uid, cart, getTotalPrice(), address);
      clearCart();
      setAddress("");
      navigate("/orders");
    } catch (error) {
      console.error("Ошибка при оформлении заказа:", error);
      alert("Произошла ошибка при оформлении заказа. Попробуйте еще раз.");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (cart.length === 0)
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">Корзина</h1>
        <div className="text-center text-gray-600 text-lg py-10">
          Корзина пуста
        </div>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">Корзина</h1>

      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                <p className="text-green-600 font-bold">{item.price} ₽</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => decreaseQuantity(item.id)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                −
              </button>
              <span className="w-6 text-center font-medium">
                {item.quantity}
              </span>
              <button
                onClick={() => increaseQuantity(item.id)}
                className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
              >
                +
              </button>

              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Поле для адреса доставки */}
      <div className="mt-8">
        <label className="block text-gray-700 font-medium mb-2">
          Адрес доставки *
        </label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Введите ваш адрес доставки..."
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows="3"
          required
        />
      </div>

      <div className="flex justify-between items-center mt-6 text-xl font-bold text-gray-800">
        <span>Итого:</span>
        <span>{getTotalPrice()} ₽</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={checkoutLoading || cart.length === 0 || !address.trim()}
        className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checkoutLoading ? "Оформление..." : "Оформить заказ"}
      </button>
    </div>
  );
}
