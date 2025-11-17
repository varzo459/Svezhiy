// src/utils/seedProducts.js
import { addProduct } from '../services/firestore';

const testProducts = [
  {
    name: "Помидоры",
    price: 150,
    category: "Овощи",
    imageUrl: "https://avatars.mds.yandex.net/i?id=f69d2a5232a32f02e0aba633682c9f0b_l-5171136-images-thumbs&n=13"
  },
  {
    name: "Огурцы",
    price: 120,
    category: "Овощи",
    imageUrl: "https://avatars.mds.yandex.net/i?id=f04dd81011b95c95bda2e64064dc19b5_l-5597741-images-thumbs&n=13"
  },
  {
    name: "Яблоки",
    price: 200,
    category: "Фрукты",
    imageUrl: "https://avatars.mds.yandex.net/i?id=55cf04f10989aa0a7a29b6cce274319d_l-3789332-images-thumbs&n=13"
  },
  {
    name: "Бананы",
    price: 180,
    category: "Фрукты",
    imageUrl: "https://avatars.mds.yandex.net/i?id=5fea68ad0b7e3112bc037a9dc8b98094bba29dea-5238322-images-thumbs&n=13"
  },
  {
    name: "Молоко",
    price: 90,
    category: "Молочные продукты",
    imageUrl: "https://ir.ozone.ru/s3/multimedia-1-0/c1000/7961307948.jpg"
  },
  {
    name: "Сыр",
    price: 350,
    category: "Молочные продукты",
    imageUrl: "https://www.afina-market.ru/upload/iblock/790/2bllv55axdrjl9oc8vkeotbs4ukue9lg.jpg"
  },
  {
    name: "Морковь",
    price: 80,
    category: "Овощи",
    imageUrl: "https://avatars.mds.yandex.net/i?id=a3d2c8e3ec6ac035e79ffd39faeb9d27_l-3631034-images-thumbs&n=13"
  },
  {
    name: "Апельсины",
    price: 220,
    category: "Фрукты",
    imageUrl: "https://avatars.mds.yandex.net/i?id=ca929bdee323659b71bce17a61cd45e9_l-5211891-images-thumbs&n=13"
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