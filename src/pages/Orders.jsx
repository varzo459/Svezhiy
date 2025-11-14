// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { getUserOrders } from "../services/firestore";
import { useAuth } from "../contexts/AuthContext";
import { Loader } from "../components/ui/Loader";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [openOrderId, setOpenOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log("Загружаем заказы для пользователя:", user.uid);
        const data = await getUserOrders(user.uid);
        console.log("Полученные заказы:", data);
        setOrders(data);
      } catch (error) {
        console.error("Ошибка при загрузке заказов:", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const toggleOrder = (id) => {
    setOpenOrderId(openOrderId === id ? null : id);
  };

  const formatDate = (date) => {
    if (!date) return "Дата не указана";

    try {
      const dateObj = new Date(date);
      return isNaN(dateObj.getTime())
        ? "Неверная дата"
        : dateObj.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    } catch {
      return "Ошибка формата даты";
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Мои заказы</h1>

      {!user ? (
        <div className="text-gray-600 text-lg text-center py-10">
          Пожалуйста, войдите в систему чтобы увидеть свои заказы.
        </div>
      ) : orders.length === 0 ? (
        <div className="text-gray-600 text-lg text-center py-10">
          У вас пока нет заказов.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-xl bg-white shadow-sm p-6"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-medium text-gray-800">
                    Дата: {formatDate(order.createdAt)}
                  </p>
                  <p className="text-gray-600">Сумма: {order.totalPrice} ₽</p>
                  <p className="text-green-600 font-semibold">
                    Статус: {order.status || "Заказ оформлен"}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Адрес: {order.address || "Не указан"}
                  </p>
                </div>

                <button
                  onClick={() => toggleOrder(order.id)}
                  className="text-green-600 hover:text-green-700 font-medium ml-4"
                >
                  {openOrderId === order.id ? "Скрыть" : "Подробнее"}
                </button>
              </div>

              {openOrderId === order.id && (
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Состав заказа:
                  </h4>
                  {order.items &&
                    order.items.map((item, index) => (
                      <div
                        key={item.id || index}
                        className="flex justify-between items-center py-2 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          {item.imageUrl && (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <span className="text-gray-700">
                            {item.name || "Неизвестный товар"}
                          </span>
                        </div>
                        <span className="text-gray-800 font-medium">
                          {item.quantity} × {item.price} ₽ ={" "}
                          {item.quantity * item.price} ₽
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
