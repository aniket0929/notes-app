import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuthStore } from "../store/authStore";
import logo from "../assets/icon.png";
import sideimg from "../assets/sideimg.jpg";

export default function Signin() {
  const navigate = useNavigate();
  const { signin, verifyOtp, error, loading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false); // New state for "Remember Me"


  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Email is required");

    await signin(email);
    setOtpSent(true);
    const otpExpiry = Date.now() + 5 * 60 * 1000;
    setExpiryTime(otpExpiry);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    await verifyOtp(otp, rememberMe); // Pass rememberMe to verifyOtp
    navigate("/notes");
  };

  const handleResendOtp = () => {
    setOtp("");
    setOtpSent(false);
    setExpiryTime(null);
    setTimer("");
  };

  useEffect(() => {
    if (!expiryTime) return;

    const interval = setInterval(() => {
      const remaining = expiryTime - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        setTimer("OTP expired");
      } else {
        const min = Math.floor(remaining / 60000);
        const sec = Math.floor((remaining % 60000) / 1000);
        setTimer(`${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTime]);

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
            Sign In
          </h2>
          <p className="text-gray-500 text-base lg:text-lg mb-6 text-center lg:text-left">
            Please login to continie to your account
          </p>

          {!otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 outline-none peer`}
                  required
                />
                <label
                  htmlFor="email"
                  className={`absolute left-3 text-gray-600 transition-all bg-white px-1`}
                  style={{
                    top: email ? "-12px" : "12px",
                    fontSize: email ? "12px" : "16px",
                    color: email ? "#2563eb" : "#4b5563",
                  }}
                >
                  Email
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>
          )}

          {otpSent && (
            <div className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type={showOtp ? "text" : "password"}
                  id="otp"
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:border-blue-600 outline-none peer`}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={timer === "OTP expired"}
                />
                <label
                  htmlFor="otp"
                  className={`absolute left-3 text-gray-600 transition-all bg-white px-1`}
                  style={{
                    top: otp ? "-12px" : "12px",
                    fontSize: otp ? "12px" : "16px",
                    color: otp ? "#2563eb" : "#4b5563",
                  }}
                >
                  OTP
                </label>
                <span
                  className="absolute right-3 top-3 cursor-pointer text-gray-600"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              {/* Resend OTP Button */}
              <button
                className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer text-center"
                onClick={handleResendOtp}
                disabled={loading}
              >
                {loading ? "Resending..." : "Resend OTP"}
              </button>

              {/* "Remember Me" Checkbox */}
              <label className="flex items-center text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mr-2 rounded border-gray-300 focus:ring-blue-500"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Keep me logged in
              </label>

              <p className="text-sm text-gray-500 text-center lg:text-left">
                {timer ? `Expires in: ${timer}` : ""}
              </p>

              {timer === "OTP expired" ? (
                <button
                  className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                  onClick={handleResendOtp}
                >
                  Get OTP Again
                </button>
              ) : (
                <button
                  className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  onClick={handleVerifyOtp}
                >
                  {loading ? "Verifying..." : "Sign In"}
                </button>
              )}
            </div>
          )}

          {error && <p className="text-red-500 mt-2 text-center lg:text-left">{error}</p>}

          <p className="mt-4 text-sm text-gray-600 text-center">
           Need an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Create One
            </span>
          </p>
        </div>

        {/* Banner Section */}
        <div className="hidden lg:block lg:w-[60%] h-screen overflow-hidden">
          <img
            src={sideimg}
            alt="Signin Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}