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

    if (status === 401) {
      localStorage.removeItem("researcherToken");
      localStorage.removeItem("researcherUser");
      localStorage.removeItem("selectedStudyId");

      const currentPath = window.location.pathname;

      if (!currentPath.includes("/researcher/login")) {
        window.location.href =
          "/researcher/login?reason=session-expired";
      }
    }

    return Promise.reject(error);
  }
);

export default api;