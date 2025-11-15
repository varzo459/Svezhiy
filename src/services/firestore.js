import { db, storage, auth } from "../firebase/config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const handleFirestoreError = (error) => {
  if (error.code === "failed-precondition") {
    console.warn("Firestore: Operation failed due to precondition");
    return [];
  } else if (error.code === "unavailable") {
    console.warn("Firestore: Service unavailable");
    return [];
  } else {
    console.error("Firestore error:", error);
    throw error;
  }
};

// ---------------- PRODUCTS ----------------
export async function getProducts() {
  try {
    const q = query(collection(db, "products"), orderBy("createdAt", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    return handleFirestoreError(error);
  }
}

export async function getProductsByCategory(category) {
  try {
    console.log("🔍 Ищем продукты категории:", category);

    const q = query(
      collection(db, "products"),
      where("category", "==", category)
    );

    const snap = await getDocs(q);
    console.log("📄 Найдено продуктов:", snap.docs.length);

    const products = snap.docs.map((doc) => {
      const data = doc.data();
      console.log(
        "📋 Продукт:",
        doc.id,
        data.name,
        "Категория:",
        data.category
      );
      return { id: doc.id, ...doc.data() };
    });

    return products;
  } catch (error) {
    console.error("❌ Error getting products by category:", error);
    return [];
  }
}

export async function addProduct(product) {
  try {
    await addDoc(collection(db, "products"), {
      ...product,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function updateProduct(id, updatedData) {
  try {
    await updateDoc(doc(db, "products", id), updatedData);
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function deleteProduct(id) {
  try {
    await deleteDoc(doc(db, "products", id));
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function uploadProductImage(file) {
  try {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
}

// ---------------- ORDERS ----------------
export async function placeOrder(order) {
  try {
    return await addDoc(collection(db, "orders"), {
      ...order,
      status: "Заказ оформлен",
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function createOrder(userId, items, totalPrice, address) {
  try {
    const orderData = {
      userId,
      items: items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
      totalPrice,
      status: "Заказ оформлен",
      createdAt: serverTimestamp(),
      userEmail: auth.currentUser?.email || "Неизвестный пользователь",
      address: address,
    };

    const docRef = await addDoc(collection(db, "orders"), orderData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

export async function getUserOrders(userId) {
  try {
    console.log("🔍 Ищем заказы для userId:", userId);

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snap = await getDocs(q);
    console.log("📄 Найдено документов:", snap.docs.length);

    const orders = snap.docs.map((doc) => {
      const data = doc.data();
      console.log("📋 Данные заказа:", doc.id, data);

      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(),
      };
    });

    return orders;
  } catch (error) {
    console.error("❌ Error getting user orders:", error);
    console.error("🔥 Error details:", error.code, error.message);
    return [];
  }
}

export async function getAllOrders() {
  try {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(),
    }));
  } catch (error) {
    console.error("❌ Error getting all orders:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    await updateDoc(doc(db, "orders", orderId), { status });
  } catch (error) {
    handleFirestoreError(error);
  }
}

export async function getAllProducts() {
  return await getProducts();
}
