// src/pages/admin/AdminOrders.jsx
import { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/firestore";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getAllOrders();
      setOrders(data);
      setLoading(false);
    }
    load();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  if (loading)
    return (
      <div className="text-center py-10 text-lg text-gray-700">
        Загрузка заказов...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Все заказы</h1>

      {orders.length === 0 && (
        <p className="text-gray-600 text-lg">Заказов пока нет</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-xl bg-white shadow-sm p-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">
                  Пользователь: {order.userEmail}
                </p>
                <p className="text-gray-600">Адрес: {order.address}</p>
                <p className="text-gray-600">Сумма: {order.totalPrice} ₽</p>
                <p className="text-green-600 font-semibold">
                  Статус: {order.status}
                </p>
              </div>

              <button
                onClick={() => toggleExpand(order.id)}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                {expandedOrder === order.id ? "Скрыть" : "Подробнее"}
              </button>
            </div>

            {expandedOrder === order.id && (
              <>
                <div className="mt-4 border-t pt-4 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between py-1">
                      <span className="text-gray-700">
                        {item.name} (x{item.quantity})
                      </span>
                      <span className="text-gray-800 font-medium">
                        {item.price} ₽
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex gap-3">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2 text-gray-700"
                  >
                    <option value="Заказ оформлен">Заказ оформлен</option>
                    <option value="В доставке">В доставке</option>
                    <option value="Доставлен">Доставлен</option>
                  </select>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
