import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth";
import { LoginRequest } from "@/lib/api/auth.types";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const { user, setUser, clearAuth } = useAuthStore();
  const router = useRouter();

  const login = async (credentials: LoginRequest) => {
    const data = await authApi.login(credentials);

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("userRole", data.user?.role ?? data.role ?? "");
    localStorage.setItem("username", data.user?.username ?? data.username ?? "");
    localStorage.setItem("userEmail", data.user?.email ?? data.email ?? "");
    localStorage.setItem("userFirstName", data.user?.firstName ?? "");
    localStorage.setItem("userLastName", data.user?.lastName ?? "");
    localStorage.setItem("userPhoto", data.user?.profilePhoto ?? "");
    localStorage.setItem("userId", String(data.user?.id ?? data.userId ?? ""));

    setUser(data.user ?? null);
    router.push("/dashboard");
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      clearAuth();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");
      localStorage.removeItem("username");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userFirstName");
      localStorage.removeItem("userLastName");
      localStorage.removeItem("userPhoto");
      localStorage.removeItem("userId");
      router.push("/login");
    }
  };

  return { user, login, logout };
};
