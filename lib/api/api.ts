import axios from "axios";

// Базовий URL для API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Створюємо axios instance для клієнтських запитів
export const nextServer = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 10000,
});

// Додаємо інтерсептор для логування помилок
nextServer.interceptors.response.use(
  (response) => response,
  (error) => {
    // Безпечне логування помилок
    const errorInfo = {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      config: {
        method: error.config?.method,
        baseURL: error.config?.baseURL,
      },
    };

    // Різний рівень логування для різних типів помилок
    if (error.response?.status === 401) {
      // 401 помилки - це нормально, логимо як інформацію
      console.log("Authentication required:", {
        url: errorInfo.url,
        status: errorInfo.status,
      });
    } else if (error.response?.status === 404) {
      // 404 помилки - також не критичні
      console.log("Resource not found:", {
        url: errorInfo.url,
        status: errorInfo.status,
      });
    } else if (error.response?.status >= 500) {
      // Server errors - логимо як помилки
      console.error("Server error:", JSON.stringify(errorInfo, null, 2));
    } else {
      // Інші помилки клиента (400, 403, etc.)
      console.warn("Client error:", JSON.stringify(errorInfo, null, 2));
    }

    return Promise.reject(error);
  }
);

// Додаємо інтерсептор для логування запитів (опціонально)
nextServer.interceptors.request.use(
  (config) => {
    console.log("API Request:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
    });
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export interface ApiError {
  message: string;
  response?: {
    status?: number;
    data?: {
      error?: string;
      message?: string;
    };
  };
  code?: string;
  config?: {
    url?: string;
    method?: string;
  };
}
