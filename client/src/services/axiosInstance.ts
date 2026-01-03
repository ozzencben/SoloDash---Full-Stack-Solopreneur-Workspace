import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const isAuthRoute =
      config.url?.includes("login") || config.url?.includes("register");

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Eğer hata 401 ise ve bu istek zaten bir "retry" (tekrar deneme) değilse
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.warn("Auth hatası yakalandı, oturum temizleniyor...");

      // Şimdilik refresh token mekanizman olmadığı için en güvenli yol:
      // Token'ı sil ve kullanıcıyı login'e yönlendir.
      localStorage.removeItem("token");

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // Konsoldaki kirliliği azaltmak için sadece kritik hataları detaylı yazdıralım
    if (error.response?.status !== 401) {
      console.error("❌ API Hatası:", {
        status: error.response?.status,
        data: error.response?.data,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
