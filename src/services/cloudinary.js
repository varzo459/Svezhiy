// src/services/cloudinary.js

// Ваши данные из Cloudinary Dashboard
const CLOUDINARY_CONFIG = {
  cloudName: "dr0ulia6k", // Замените на ваш Cloud Name
  uploadPreset: "products", // Замените на имя вашего upload preset
};

export const uploadToCloudinary = async (file) => {
  try {
    console.log("📤 Начинаем загрузку в Cloudinary:", file.name);

    // Создаем FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);
    formData.append("folder", "svezhiy-products"); // Опционально: папка в Cloudinary

    // Отправляем запрос к Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Cloudinary API error:", errorText);
      throw new Error(
        `Ошибка Cloudinary: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    if (data.error) {
      console.error("❌ Cloudinary error:", data.error);
      throw new Error(data.error.message || "Ошибка загрузки в Cloudinary");
    }

    console.log("✅ Изображение загружено:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("❌ Ошибка загрузки в Cloudinary:", error);

    // Более понятные сообщения об ошибках
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Проблемы с интернет-соединением. Проверьте подключение."
      );
    } else if (error.message.includes("413")) {
      throw new Error("Файл слишком большой. Максимальный размер 10MB.");
    } else {
      throw new Error(`Не удалось загрузить изображение: ${error.message}`);
    }
  }
};

// Функция для удаления изображения (опционально)
export const deleteFromCloudinary = async (publicId) => {
  // Для удаления нужен API Secret, лучше делать на бэкенде
  console.log("⚠️ Удаление изображений требует бэкенд");
};

export default CLOUDINARY_CONFIG;
