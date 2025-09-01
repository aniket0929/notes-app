import { create } from "zustand";
import { axiosInstance } from "../libs/axios";

interface AuthState {
  user: { _id: string; email: string; name?: string } | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;

  signupData: { name?: string; email: string; dob?: string } | null;
  signinEmail: string | null;

  signup: (name: string, email: string, dob: string) => Promise<void>;
  signin: (email: string) => Promise<void>;
  verifyOtp: (otp: string, rememberMe: boolean) => Promise<void>; // Modified
  signout: () => Promise<void>;
  clearError: () => void;
  autoSignIn: () => Promise<void>; // Added
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
  signupData: null,
  signinEmail: null,

  clearError: () => set({ error: null }),

  signup: async (name, email, dob) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.post("/auth/signup", { name, email, dob });
      set({ signupData: { name, email, dob }, signinEmail: email });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Signup failed" });
    } finally {
      set({ loading: false });
    }
  },

  signin: async (email) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.post("/auth/signin", { email });
      set({ signinEmail: email, signupData: null });
    } catch (err: any) {
      set({ error: err.response?.data?.message || "Signin failed" });
    } finally {
      set({ loading: false });
    }
  },

  verifyOtp: async (otp, rememberMe) => { // Modified
    try {
      const { signupData, signinEmail } = get();
      const email = signupData?.email || signinEmail;
      if (!email) throw new Error("No email available for OTP verification");

      set({ loading: true, error: null });
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });

      const userData = {
        _id: res.data._id,
        email: res.data.email,
        name: res.data.name || signupData?.name || "",
      };

      set({
        user: userData,
        isLoggedIn: true,
        signupData: null,
        signinEmail: null,
      });

      if (rememberMe) {
        // Set a long-lived token in localStorage
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("tokenExpiry", JSON.stringify(Date.now() + 5 * 24 * 60 * 60 * 1000)); // 5 days
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("tokenExpiry");
      }
    } catch (err: any) {
      set({ error: err.response?.data?.message || err.message || "OTP verification failed" });
    } finally {
      set({ loading: false });
    }
  },

  signout: async () => {
    try {
      set({ loading: true });
      await axiosInstance.post("/auth/signout");
      localStorage.removeItem("authToken"); // Clear token on signout
      localStorage.removeItem("tokenExpiry");
      set({ user: null, isLoggedIn: false, signupData: null, signinEmail: null });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },

  autoSignIn: async () => {
    const token = localStorage.getItem("authToken");
    const expiry = localStorage.getItem("tokenExpiry");

    if (!token || !expiry || Date.now() >= JSON.parse(expiry)) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      return;
    }

    try {
      set({ loading: true, error: null });
      // Validate token with backend
      const res = await axiosInstance.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      set({
        user: { _id: res.data._id, email: res.data.email, name: res.data.name },
        isLoggedIn: true,
      });
    } catch (error) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("tokenExpiry");
      set({ error: "Auto sign-in failed", user: null, isLoggedIn: false });
    } finally {
      set({ loading: false });
    }
  },
}));