// src/pages/admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/firestore";
import { uploadToCloudinary } from "../../services/cloudinary";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Овощи",
    image: null,
    imagePreview: null,
  });
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите файл изображения (JPG, PNG, WEBP)");
        return;
      }

      // Проверка размера файла
      if (file.size > 10 * 1024 * 1024) {
        alert("Размер файла не должен превышать 10MB");
        return;
      }

      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Базовая валидация
    if (!form.name.trim() || !form.price) {
      alert("Пожалуйста, заполните название и цену");
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      let imageUrl = null;

      // Загружаем изображение если оно есть
      if (form.image) {
        try {
          imageUrl = await uploadToCloudinary(form.image);
        } catch (uploadError) {
          console.error("Ошибка загрузки изображения:", uploadError);
          alert(`Ошибка загрузки изображения: ${uploadError.message}`);
          setLoading(false);
          setUploading(false);
          return;
        }
      }

      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category,
        ...(imageUrl && { imageUrl }),
      };

      console.log("Сохраняем продукт:", productData);

      if (editId) {
        await updateProduct(editId, productData);
        alert("Продукт обновлен!");
      } else {
        await addProduct(productData);
        alert("Продукт добавлен!");
      }

      // Обновляем список
      const updated = await getProducts();
      setProducts(updated);

      // Сбрасываем форму
      setForm({
        name: "",
        price: "",
        category: "Овощи",
        image: null,
        imagePreview: null,
      });
      setEditId(null);
    } catch (error) {
      console.error("Ошибка при сохранении продукта:", error);
      alert(`Ошибка: ${error.message}`);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      image: null,
      imagePreview: product.imageUrl,
    });
    setEditId(product.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Удалить этот продукт?")) return;

    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(await getProducts());
      alert("✅ Продукт удален!");
    } catch (error) {
      console.error("Ошибка удаления:", error);
      alert("Ошибка при удалении продукта");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-4">
        Управление товарами
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-xl p-6 mb-10 space-y-4"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Название товара *
          </label>
          <input
            className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Например: Яблоки Голден"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Цена (руб) *
          </label>
          <input
            className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Например: 150"
            type="number"
            min="1"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Категория *
          </label>
          <select
            className="border p-2 w-full rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="Овощи">Овощи</option>
            <option value="Фрукты">Фрукты</option>
            <option value="Молочные продукты">Молочные продукты</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Изображение товара
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <small className="text-gray-500 text-sm">
            JPG, PNG, WEBP до 10MB. Необязательное поле.
          </small>
        </div>

        {/* Preview изображения */}
        {form.imagePreview && (
          <div className="mt-2 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2 font-medium">
              Предпросмотр:
            </p>
            <img
              src={form.imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border shadow-sm"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading
            ? "Загрузка изображения..."
            : loading
            ? "Сохранение..."
            : editId
            ? "Сохранить изменения"
            : "Добавить продукт"}
        </button>
      </form>

      {/* Список продуктов */}
      {loading ? (
        <div className="text-center text-gray-700 py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          <p className="mt-2">Загрузка продуктов...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white shadow rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={
                    product.imageUrl ||
                    "https://via.placeholder.com/300x200?text=Нет+изображения"
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/300x200?text=Нет+изображения";
                  }}
                />
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Категория: {product.category}
                </p>
                <p className="text-green-600 font-bold text-xl mt-2">
                  {product.price} ₽
                </p>
              </div>

              <div className="flex justify-between mt-4 pt-4 border-t">
                <button
                  onClick={() => handleEdit(product)}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
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
