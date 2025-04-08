import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import api from "@/lib/api"; // assuming this is your axios instance
import { tc } from "@/lib/tc";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; // Return context values like `token`
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const [response, error] = await tc(() => api.post("/api/auth/refresh"));
      console.log(response);
      if (response.data.numCode == 1) {
        setToken(null);
      } else {
        setToken(response.data.objData);
      }
      setLoading(false); // Finish loading after token check
    };

    fetchMe();
  }, []);

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => api.interceptors.request.eject(authInterceptor);
  }, [token]);

  useLayoutEffect(() => {
    const refreshInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response.status === 1 &&
          error.response.data.message === "Unauthorized"
        ) {
          const [response, error] = await tc(() =>
            api.get("/api/auth/refresh")
          );

          if (error) {
            setToken(null);
          } else {
            setToken(response.data.objData);
            originalRequest.headers.Authorization = `Bearer ${response.data.objData}`;
            originalRequest._retry = true;

            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  const login = async (credentials) => {
    const [response, error] = await tc(() =>
      api.post("/api/auth/login", credentials)
    );
    if (error) {
      setToken(null);
      return { success: false, error };
    } else {
      setToken(response.data.objData); // Save token from response
      return { success: true, error };
    }
  };

  const logout = async () => {
    const [response, error] = await tc(() => api.post("/api/auth/logout"));
    setToken(null);
  };

  const signup = async (userData) => {
    const [response, error] = await tc(() =>
      api.post("/api/auth/signup", userData)
    );
    console.log(response.data);
    if (error) {
      setToken(null);
      return { success: false, error };
    } else {
      setToken(response.data.objData);
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, signup, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
