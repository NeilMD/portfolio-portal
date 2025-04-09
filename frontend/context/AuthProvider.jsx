import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
} from "react";
import api from "@/lib/api";
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
  const [userId, setUserId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    const [response, error] = await tc(() => api.post("/api/auth/refresh"));
    console.log(response);
    if (!response || response?.data?.numCode == 1) {
      setToken(null);
    } else {
      setToken(response.data.objData.accessToken);
      setUserId(response.data.objData.userId);
    }
    setLoading(false); // Finish loading after token check
  };

  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });
    return () => {
      if (authInterceptor) {
        api?.interceptors?.request?.eject(authInterceptor);
      }
    };
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
            setToken(response.data.objData.accessToken);
            setUserId(response.data.objData.userId);
            originalRequest.headers.Authorization = `Bearer ${response.data.objData}`;
            originalRequest._retry = true;

            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      if (refreshInterceptor) {
        api?.interceptors?.response?.eject(refreshInterceptor);
      }
    };
  }, []);

  const login = async (credentials) => {
    const [response, error] = await tc(() =>
      api.post("/api/auth/login", credentials)
    );
    console.log(error);
    if (error || response.data.numCode == 1) {
      setToken(null);
      return {
        success: false,
        error: response?.data?.objError || error?.response?.statusText,
      };
    } else {
      setToken(response.data.objData.accessToken); // Save token from response
      setUserId(response.data.objData.userId);
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
    if (error || response.data.numCode == 1) {
      setToken(null);
      return {
        success: false,
        error: response?.data?.objError || error?.response?.statusText,
      };
    } else {
      setToken(response.data.objData.accessToken);
      setUserId(response.data.objData.userId);
      return { success: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, login, logout, signup, loading, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
