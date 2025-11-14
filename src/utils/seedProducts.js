// src/utils/seedProducts.js
import { addProduct } from '../services/firestore';

const testProducts = [
  {
    name: "Помидоры",
    price: 150,
    category: "Овощи",
    imageUrl: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Огурцы",
    price: 120,
    category: "Овощи",
    imageUrl: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Яблоки",
    price: 200,
    category: "Фрукты",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Бананы",
    price: 180,
    category: "Фрукты",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Молоко",
    price: 90,
    category: "Молочные продукты",
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Сыр",
    price: 350,
    category: "Молочные продукты",
    imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Морковь",
    price: 80,
    category: "Овощи",
    imageUrl: "https://images.unsplash.com/photo-1540420828642-fca2c5c18abe?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  },
  {
    name: "Апельсины",
    price: 220,
    category: "Фрукты",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
  }
];

export async function seedProducts() {
  try {
    for (const product of testProducts) {
      await addProduct(product);
      console.log(`Добавлен продукт: ${product.name}`);
    }
    console.log('Все продукты добавлены!');
  } catch (error) {
    console.error('Ошибка при добавлении продуктов:', error);
  }
}