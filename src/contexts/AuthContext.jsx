// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, googleProvider, githubProvider, db } from "../firebase/config";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(false); // Добавьте это состояние

  async function checkAdminRole(uid) {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);

    if (snap.exists() && snap.data().role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  async function createUserIfNotExists(user) {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: "user",
        createdAt: new Date(),
      });
    }
  }

  const signInWithGoogle = async () => {
    setAuthLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
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
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("GitHub auth error:", error);
      alert(`Ошибка входа через GitHub: ${error.message}`);
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
    setUser({ ...auth.currentUser });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await createUserIfNotExists(currentUser);
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
    authLoading, // Добавьте это
    isAdmin,
    signInWithGoogle,
    signInWithGithub,
    logout,
    updatePhoto,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}