import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const [step, setStep] = useState("form"); // "form" or "otp"
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student" });
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  
  const { register, verifyRegistration, isLoading, error, successMessage, clearMessages } = useAuthStore();
  const navigate = useNavigate();

  const [localError, setLocalError] = useState("");

  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    if (step === "form") {
      if (!formData.email.toLowerCase().endsWith("@cdgi.edu.in")) {
        setLocalError("Please use your official @cdgi.edu.in email address to register.");
        return;
      }
      
      const res = await register(formData);
      if (res.step === "otp_required") {
        setStep("otp");
      }
    } else {
      if (otp.length !== 6) {
        setLocalError("Please enter a valid 6-digit OTP code.");
        return;
      }

      const success = await verifyRegistration(formData.email, otp);
      if (success) {
        setFormData({ name: "", email: "", password: "", role: "student" });
        setOtp("");
        // Registration is fully complete, show standard success message which allows user to click Log in
        setStep("form"); 
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-300 py-10 px-4">
      <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Student Sign Up</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            {step === "form" ? "Join the Student Help Desk System" : "Verify your identity"}
          </p>
        </div>

        {(error || localError) && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {error || localError}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-sm text-center border border-green-100">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === "form" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">College Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="student@cdgi.edu.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Must be an @cdgi.edu.in email address</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all pr-10"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 text-center">Enter 6-Digit Verification Code</label>
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
                We sent a secure code to <strong>{formData.email}</strong>. This code will expire in 10 minutes.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-4"
          >
            {isLoading ? "Processing..." : (step === "form" ? "Continue Registration" : "Verify Account")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 flex flex-col gap-2">
          {step === "otp" && (
            <button 
              type="button" 
              onClick={() => setStep("form")}
              className="text-primary-600 dark:text-primary-400 font-medium hover:underline mb-2"
            >
              Change Email
            </button>
          )}
          <span>Already have an account? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Log in</Link></span>
        </div>
      </div>
    </div>
  );
}
