import { useState } from "react";
import { axiosInstance } from "../libs/axios";
import DateInput from "../components/DateInput";
import sideimg from "../assets/sideimg.jpg";
import logo from "../assets/icon.png";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // Import eye icons

export default function Signup() {
  const [form, setForm] = useState({ name: "", dob: null as Date | null, email: "" });
  const [otpVisible, setOtpVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false); // Track OTP visibility
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

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
      setLoading(true); // Start loading
      const payload = { ...form, dob: form.dob.toISOString() };
      const res = await axiosInstance.post("/auth/signup", payload);
      setOtpVisible(true);
      startTimer(300);
      console.log(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong!");
      setOtpVisible(false);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true); // Start loading
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
    } finally {
      setLoading(false); // End loading
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

          <div className="relative mb-3">
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 outline-none peer`}
              required
            />
            <label
              htmlFor="name"
              className={`absolute left-3 text-gray-600 transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-blue-600 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 bg-white px-1`}
              style={{
                top: form.name ? "-12px" : "12px",
                fontSize: form.name ? "12px" : "16px",
                color: form.name ? "#2563eb" : "#4b5563",
              }}
            >
              Your Name
            </label>
          </div>

          <DateInput selectedDate={form.dob} onChange={handleDateChange} placeholder=" Date of Birth" />

          <div className="relative mb-3">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 outline-none peer`}
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-3 text-gray-600 transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-blue-600 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 bg-white px-1`}
              style={{
                top: form.email ? "-12px" : "12px",
                fontSize: form.email ? "12px" : "16px",
                color: form.email ? "#2563eb" : "#4b5563",
              }}
            >
              Email
            </label>
          </div>

          {!otpVisible && (
            <button
              type="button"
              onClick={handleGetOtp}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Get OTP"}
            </button>
          )}

          {otpVisible && (
            <div className="flex flex-col gap-2">
              <div className="relative">
                <input
                  type={showOtp ? "text" : "password"} // Toggle input type
                  name="otp"
                  id="otp"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 outline-none peer`}
                />
                <label
                  htmlFor="otp"
                  className={`absolute left-3 text-gray-600 transition-all peer-focus:-top-2 peer-focus:left-3 peer-focus:text-blue-600 peer-focus:text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-600 bg-white px-1`}
              style={{
                top: otp ? "-12px" : "12px",
                fontSize: otp ? "12px" : "16px",
                color: otp ? "#2563eb" : "#4b5563",
              }}
                >
                  Enter OTP
                </label>
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>
              <p className="text-gray-500 text-sm text-center lg:text-left">
                OTP expires in: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
              </p>
              <button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Sign Up"}
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
          <img src={sideimg} alt="Signup Banner" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}