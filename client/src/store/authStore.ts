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
  verifyOtp: (otp: string) => Promise<void>;
  signout: () => Promise<void>;
  clearError: () => void;
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

  verifyOtp: async (otp) => {
    try {
      const { signupData, signinEmail } = get();
      const email = signupData?.email || signinEmail;
      if (!email) throw new Error("No email available for OTP verification");

      set({ loading: true, error: null });
      const res = await axiosInstance.post("/auth/verify-otp", { email, otp });
      set({
        user: { _id: res.data._id, email: res.data.email, name: signupData?.name },
        isLoggedIn: true,
        signupData: null,
        signinEmail: null,
      });
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
      set({ user: null, isLoggedIn: false, signupData: null, signinEmail: null });
    } catch (err) {
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
