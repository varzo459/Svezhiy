// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} from "../../services/firestore";

import { seedProducts } from "../../utils/seedProducts"; // Добавьте этот импорт

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Овощи",
    image: null,
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSeedProducts = async () => {
    if (window.confirm('Добавить тестовые продукты?')) {
      setLoading(true);
      await seedProducts();
      const updated = await getProducts();
      setProducts(updated);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = null;
    if (form.image) imageUrl = await uploadProductImage(form.image);

    if (editId) {
      await updateProduct(editId, {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        ...(imageUrl && { imageUrl }),
      });
    } else {
      await addProduct({
        name: form.name,
        price: Number(form.price),
        category: form.category,
        imageUrl,
      });
    }

    const updated = await getProducts();
    setProducts(updated);
    setForm({ name: "", price: "", category: "Овощи", image: null });
    setEditId(null);
    setLoading(false);
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: null,
    });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    await deleteProduct(id);
    setProducts(await getProducts());
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Управление товарами
      </h1>

      {/* Добавьте эту кнопку */}
      <div className="mb-6">
        <button
          onClick={handleSeedProducts}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
        >
          Добавить тестовые продукты
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-10 space-y-4"
      >
        <input
          className="border p-2 w-full rounded"
          placeholder="Название"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border p-2 w-full rounded"
          placeholder="Цена"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />

        <select
          className="border p-2 w-full rounded"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option>Овощи</option>
          <option>Фрукты</option>
          <option>Молочные продукты</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
        >
          {editId ? "Сохранить изменения" : "Добавить продукт"}
        </button>
      </form>

      {loading ? (
        <div className="text-center text-gray-700">Загрузка...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((p) => (
            <div key={p.id} className="bg-white shadow rounded-xl p-6">
              <img
                src={p.imageUrl}
                alt={p.name}
                className="h-40 w-full object-cover rounded-lg"
              />
              <h2 className="text-xl font-semibold mt-4">{p.name}</h2>
              <p className="text-gray-600">Категория: {p.category}</p>
              <p className="text-green-600 font-bold">{p.price} ₽</p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleEdit(p)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
