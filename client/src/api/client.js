import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("researcherToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const currentPath = window.location.pathname;

    const isLoginPage = currentPath.includes("/researcher/login");
    const isAuthRequest = requestUrl.includes("/auth/login");

    if (status === 401 && !isLoginPage && !isAuthRequest) {
      localStorage.removeItem("researcherToken");
      localStorage.removeItem("researcherUser");
      localStorage.removeItem("selectedStudyId");

      window.location.href = "/researcher/login?reason=session-expired";
    }

    return Promise.reject(error);
  }
);

export default api;