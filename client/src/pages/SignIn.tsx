import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useAuthStore } from "../store/authStore";

export default function Signin() {
  const navigate = useNavigate();
  const { signin, verifyOtp, error, loading, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [expiryTime, setExpiryTime] = useState<number | null>(null);
  const [timer, setTimer] = useState<string>("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return alert("Email is required");

    await signin(email);
    setOtpSent(true);
    const otpExpiry = Date.now() + 5 * 60 * 1000; // sync with backend OTP expiry if returned
    setExpiryTime(otpExpiry);
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert("Enter OTP");
    await verifyOtp(otp);
    navigate("/notes");
  };

  const handleResendOtp = () => {
    setOtp("");
    setOtpSent(false);
    setExpiryTime(null);
    setTimer("");
  };

  // Timer effect
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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-5xl shadow-lg rounded-xl overflow-hidden">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-2">Sign in</h2>
          <p className="text-gray-500 mb-6">Sign in to your account</p>

          {!otpSent && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                {loading ? "Sending OTP..." : "Get OTP"}
              </button>
            </form>
          )}

          {otpSent && (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showOtp ? "text" : "password"}
                  placeholder="Enter OTP"
                  className="w-full p-3 border rounded-lg"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={timer === "OTP expired"}
                />
                <span
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowOtp(!showOtp)}
                >
                  {showOtp ? <AiFillEyeInvisible /> : <AiFillEye />}
                </span>
              </div>

              <p className="text-sm text-gray-500">{timer ? `Expires in: ${timer}` : ""}</p>

              {timer === "OTP expired" ? (
                <button
                  className="w-full bg-yellow-500 text-white p-3 rounded-lg font-semibold hover:bg-yellow-600 transition"
                  onClick={handleResendOtp}
                >
                  Get OTP Again
                </button>
              ) : (
                <button
                  className="w-full bg-green-500 text-white p-3 rounded-lg font-semibold hover:bg-green-600 transition"
                  onClick={handleVerifyOtp}
                >
                  {loading ? "Verifying..." : "Sign In"}
                </button>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-500 mt-2" onClick={clearError}>
              {error}
            </p>
          )}

          <p className="mt-4 text-sm text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 font-semibold cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </p>
        </div>

        {/* Right Side */}
        <div className="hidden md:block md:w-1/2 bg-blue-600">
          <img
            src="/signup-banner.png"
            alt="Signin Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
