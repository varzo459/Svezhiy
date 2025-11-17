// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, githubProvider, db } from "../firebase/config";
import {
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // В AuthContext.jsx обновите функцию createOrUpdateUserDocument
  async function createOrUpdateUserDocument(user, additionalData = {}) {
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    // Если пользователь уже существует, сохраняем его текущую роль
    const existingData = snap.exists() ? snap.data() : {};

    const userData = {
      email: user.email,
      displayName:
        user.displayName ||
        additionalData.displayName ||
        user.email?.split("@")[0] ||
        "Пользователь",
      photoURL: user.photoURL || additionalData.photoURL || "",
      // Сохраняем существующую роль, если она есть, иначе используем новую
      role: existingData.role || additionalData.role || "user",
      emailVerified: user.emailVerified || false,
      createdAt:
        existingData.createdAt || additionalData.createdAt || new Date(),
      lastLoginAt: new Date(),
      ...additionalData,
    };

    // Убираем role из additionalData если она уже есть в existingData
    if (existingData.role) {
      delete userData.role;
    }

    if (!snap.exists()) {
      // Создаем нового пользователя
      await setDoc(userRef, userData);
      console.log(
        "✅ Создан документ пользователя:",
        user.uid,
        "Роль:",
        userData.role
      );
    } else {
      // Обновляем существующего пользователя, но сохраняем роль
      const updateData = {
        ...userData,
        role: existingData.role, // Всегда сохраняем существующую роль
        createdAt: existingData.createdAt, // Сохраняем оригинальную дату создания
      };

      await setDoc(userRef, updateData, { merge: true });
      console.log(
        "✅ Обновлен документ пользователя:",
        user.uid,
        "Роль:",
        updateData.role
      );
    }
  }

  async function checkAdminRole(uid) {
    if (!uid) {
      setIsAdmin(false);
      return;
    }

    try {
      const userRef = doc(db, "users", uid);
      const snap = await getDoc(userRef);

      if (snap.exists() && snap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("❌ Ошибка проверки роли админа:", error);
      setIsAdmin(false);
    }
  }

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Создаем/обновляем документ пользователя после входа
      await createOrUpdateUserDocument(result.user, {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    } catch (error) {
      console.error("Google auth error:", error);
      alert(`Ошибка входа через Google: ${error.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setAuthLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      // Создаем/обновляем документ пользователя после входа
      await createOrUpdateUserDocument(result.user, {
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      });
    } catch (error) {
      console.error("GitHub auth error:", error);
      alert(`Ошибка входа через GitHub: ${error.message}`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Функция для входа по email/password
  const signInWithEmail = async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Создаем/обновляем документ пользователя после входа
      await createOrUpdateUserDocument(result.user);
      return result;
    } catch (error) {
      console.error("Email auth error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  // Функция для регистрации по email/password
  const signUpWithEmail = async (email, password) => {
    setAuthLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Создаем документ пользователя после регистрации
      await createOrUpdateUserDocument(result.user, {
        displayName: email.split("@")[0], // Используем часть email как имя
      });
      return result;
    } catch (error) {
      console.error("Email registration error:", error);
      throw error;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updatePhoto = async (photoURL) => {
    if (!auth.currentUser) return;
    await updateProfile(auth.currentUser, { photoURL });
    // Обновляем документ пользователя
    await createOrUpdateUserDocument(auth.currentUser, { photoURL });
    setUser({ ...auth.currentUser });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Создаем/обновляем документ пользователя при изменении состояния аутентификации
        await createOrUpdateUserDocument(currentUser);
        await checkAdminRole(currentUser.uid);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    authLoading,
    isAdmin,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail, // Добавляем новую функцию
    signUpWithEmail, // Добавляем новую функцию
    logout,
    updatePhoto,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
