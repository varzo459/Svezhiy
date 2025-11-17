// src/pages/AuthPage.jsx
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";

export default function AuthPage() {
  const {
    user,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail, // Добавляем эту функцию
    signUpWithEmail, // Добавляем эту функцию
  } = useAuth(); // Получаем функции из AuthContext

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [forgotPassword, setForgotPassword] = useState(false);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [awaitingEmailVerification, setAwaitingEmailVerification] =
    useState(false);

  // Форма данных
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getErrorMessage = (error) => {
    switch (error.code) {
      case "auth/email-already-in-use":
        return "Этот email уже используется.";
      case "auth/invalid-email":
        return "Неверный формат email.";
      case "auth/weak-password":
        return "Пароль слишком слабый. Используйте минимум 6 символов.";
      case "auth/user-not-found":
        return "Пользователь с таким email не найден.";
      case "auth/wrong-password":
        return "Неверный пароль. Попробуйте еще раз.";
      case "auth/invalid-credential":
        return "Неверный email или пароль.";
      case "auth/too-many-requests":
        return "Слишком много попыток. Попробуйте позже.";
      case "auth/network-request-failed":
        return "Ошибка сети. Проверьте подключение к интернету.";
      case "auth/user-disabled":
        return "Этот аккаунт был заблокирован.";
      case "auth/requires-recent-login":
        return "Для этого действия требуется повторный вход.";
      default:
        return "Произошла ошибка. Попробуйте еще раз.";
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (activeTab === "register") {
        // Регистрация
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Пароли не совпадают");
        }
        if (formData.password.length < 6) {
          throw new Error("Пароль должен содержать минимум 6 символов");
        }

        // Используем функцию из AuthContext
        const userCredential = await signUpWithEmail(
          formData.email,
          formData.password
        );

        // Отправляем email для подтверждения
        await sendEmailVerification(userCredential.user);

        // Переходим в режим ожидания подтверждения
        setAwaitingEmailVerification(true);
        setEmailVerificationSent(true);
        setMessage({
          type: "success",
          text: "Регистрация успешна! На вашу почту отправлено письмо с ссылкой для подтверждения.",
        });
      } else {
        // Вход - используем функцию из AuthContext
        const userCredential = await signInWithEmail(
          formData.email,
          formData.password
        );

        // Проверяем, подтвержден ли email
        if (!userCredential.user.emailVerified) {
          setMessage({
            type: "warning",
            text: "Ваш email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите email.",
          });
          // Выходим чтобы пользователь подтвердил email
          await auth.signOut();
          return;
        }

        setMessage({ type: "success", text: "Вход выполнен успешно!" });
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage({
        type: "success",
        text: "Письмо для сброса пароля отправлено на вашу почту!",
      });
      setForgotPassword(false);
    } catch (error) {
      console.error("Password reset error:", error);
      setMessage({
        type: "error",
        text: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setLoading(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        setMessage({
          type: "success",
          text: "Письмо с подтверждением отправлено повторно!",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCheck = async () => {
    setLoading(true);
    try {
      // Обновляем пользователя чтобы проверить статус верификации
      await auth.currentUser?.reload();
      const currentUser = auth.currentUser;

      if (currentUser?.emailVerified) {
        setMessage({ type: "success", text: "Email успешно подтвержден!" });
        setAwaitingEmailVerification(false);
        // Автоматически входим после подтверждения
        await signInWithEmail(formData.email, formData.password);
      } else {
        setMessage({
          type: "warning",
          text: "Email еще не подтвержден. Проверьте вашу почту и перейдите по ссылке из письма.",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setLoading(false);
    }
  };

  // Если ожидаем подтверждения email
  if (awaitingEmailVerification) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-8 text-center">
          Подтвердите ваш Email
        </h1>

        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Проверьте вашу почту
            </h2>
            <p className="text-gray-600 mb-4">
              Мы отправили письмо с ссылкой для подтверждения на адрес:
            </p>
            <p className="font-medium text-green-600">{formData.email}</p>
          </div>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : message.type === "warning"
                  ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleVerificationCheck}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Проверка..." : "Я подтвердил email"}
            </button>

            <button
              onClick={handleResendVerification}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition hover:bg-gray-50 disabled:opacity-50"
            >
              Отправить письмо повторно
            </button>

            <button
              onClick={() => {
                setAwaitingEmailVerification(false);
                setEmailVerificationSent(false);
                setFormData({ email: "", password: "", confirmPassword: "" });
              }}
              className="w-full text-gray-600 font-medium py-2 hover:text-gray-800 transition"
            >
              Вернуться к регистрации
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">
              Не пришло письмо?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Проверьте папку "Спам"</li>
              <li>• Убедитесь что email указан правильно</li>
              <li>• Подождите несколько минут</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mt-6 mb-8 text-center">
        {forgotPassword ? "Восстановление пароля" : "Вход в аккаунт"}
      </h1>

      {/* Сообщения */}
      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-800"
              : message.type === "warning"
              ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {!forgotPassword ? (
        <>
          {/* Табы для входа/регистрации */}
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                activeTab === "login"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Вход
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition ${
                activeTab === "register"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Регистрация
            </button>
          </div>

          {/* Форма email/пароль */}
          <div className="bg-white border rounded-xl shadow-sm p-6 mb-6">
            <form onSubmit={handleEmailAuth}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Введите пароль"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {activeTab === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Подтвердите пароль
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Повторите пароль"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                )}

                {activeTab === "login" && (
                  <button
                    type="button"
                    onClick={() => setForgotPassword(true)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Забыли пароль?
                  </button>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Загрузка..."
                    : activeTab === "login"
                    ? "Войти"
                    : "Зарегистрироваться"}
                </button>
              </div>
            </form>
          </div>

          {/* Разделитель */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">или</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* OAuth кнопки */}
          <div className="space-y-4">
            <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Продолжить с Google
            </button>

            <button
              onClick={signInWithGithub}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              Продолжить с GitHub
            </button>
          </div>
        </>
      ) : (
        /* Форма восстановления пароля */
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <form onSubmit={handlePasswordReset}>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm mb-4">
                Введите ваш email, и мы отправим вам ссылку для сброса пароля.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setForgotPassword(false)}
                  className="flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition hover:bg-gray-50"
                >
                  Назад
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition disabled:opacity-50"
                >
                  {loading ? "Отправка..." : "Отправить"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
