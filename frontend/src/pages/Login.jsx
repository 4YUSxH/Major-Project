import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, verifyLogin, isLoading, error, successMessage } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === "form") {
      const res = await login(email, password);
      if (res.step === "otp_required") {
        setStep("otp");
      } else if (res.step === "success") {
        navigate("/");
      }
    } else {
      const success = await verifyLogin(email, otp);
      if (success) {
        navigate("/");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-300 py-10 px-4">
      <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            {step === "form" ? "Welcome Back" : "Security Verification"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {step === "form" ? "Login to your Help Desk account" : "Please enter the OTP sent to your email"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-sm text-center border border-green-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === "form" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Enter 6-Digit Code</label>
              <input
                type="text"
                required
                maxLength="6"
                className="w-full px-4 py-4 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all text-center text-2xl tracking-widest font-mono"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                Code sent to <strong>{email}</strong>
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center"
          >
            {isLoading ? "Verifying..." : (step === "form" ? "Sign In" : "Confirm Login")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2">
          {step === "otp" && (
            <button 
              type="button" 
              onClick={() => setStep("form")}
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline mb-2"
            >
              Back to Login
            </button>
          )}
          <span>Don't have an account? <Link to="/register" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Student Sign Up</Link></span>
        </div>
      </div>
    </div>
  );
}
