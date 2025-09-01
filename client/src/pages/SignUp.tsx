import { useState } from "react";
import { axiosInstance } from "../libs/axios";
import DateInput from "../components/DateInput"; 
import sideimg from "../assets/sideimg.jpg";
import logo from "../assets/icon.png";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", dob: null as Date | null, email: "" });
  const [otpVisible, setOtpVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const navigate=useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setForm({ ...form, dob: date });
  };

  const startTimer = (seconds: number) => {
    setTimer(seconds);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleGetOtp = async () => {
    setError(null);
    if (!form.dob) {
      setError("Please select your date of birth");
      return;
    }
    try {
      const payload = { ...form, dob: form.dob.toISOString() };
      const res = await axiosInstance.post("/auth/signup", payload);
      setOtpVisible(true);
      startTimer(300);
      console.log(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
      setOtpVisible(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        email: form.email,
        otp,
      });
      console.log(res.data);
      // Redirect to dashboard here
        navigate("/notes");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "OTP verification failed!");
    }
  };

  return (
    <div className="min-h-screen flex lg:flex-row bg-white font-inter relative">
      {/* Logo on top-left for desktop */}
      <div className="absolute top-4 left-4 hidden lg:flex items-center gap-2 z-50">
        <img src={logo} alt="Logo" className="w-8 h-8" />
        <span className="text-xl font-bold text-gray-800">HD</span>
      </div>

      <div className="flex flex-col lg:flex-row w-full shadow-lg overflow-hidden">
        {/* Form Section */}
        <div className="w-full lg:w-[45%] p-12 flex flex-col justify-center">
          {/* Logo above h2 on mobile */}
          <div className="flex lg:hidden flex-col items-center mb-6 gap-2">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-800">HD</span>
          </div>

          <h2 className="font-bold text-3xl lg:text-4xl leading-[110%] tracking-[-0.04em] mb-2 text-center lg:text-left">
            Sign Up
          </h2>
          <p className="text-gray-500 text-base lg:text-lg mb-6 text-center lg:text-left">
            Sign up to enjoy the features of HD Notes
          </p>

          {error && <p className="text-red-500 mb-2 text-center lg:text-left">{error}</p>}

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:border-blue-600 outline-none"
            required
          />

          <DateInput
            selectedDate={form.dob}
            onChange={handleDateChange}
            placeholder=" Date of Birth"
            
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:border-blue-600 outline-none"
            required
          />

          {!otpVisible && (
            <button
              type="button"
              onClick={handleGetOtp}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
            >
              Get OTP
            </button>
          )}

          {otpVisible && (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 outline-none"
              />
              <p className="text-gray-500 text-sm text-center lg:text-left">
                OTP expires in: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </div>
          )}

          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 font-semibold">
              Sign in
            </a>
          </p>
        </div>

        {/* Banner Section */}
        <div className="hidden lg:block lg:w-[60%] h-screen overflow-hidden">
          <img
            src={sideimg}
            alt="Signup Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
