// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext"; // Добавьте этот импорт
import ProtectedRoute from "./routes/ProtectedRoute";

// Layout components
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AuthPage from "./pages/AuthPage";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {" "}
        {/* Добавьте CartProvider */}
        <Router>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/auth" element={<AuthPage />} />

                {/* Protected */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin only */}
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoute admin>
                      <AdminOrders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoute admin>
                      <AdminProducts />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
