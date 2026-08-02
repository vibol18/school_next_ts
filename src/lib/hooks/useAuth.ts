import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";
import { LoginRequest, LoginResponse } from "@/lib/api/auth.types";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { user, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    const data = response.data as LoginResponse;

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user ?? null);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      router.push("/login");
    }
  };

  return { user, login, logout };
};