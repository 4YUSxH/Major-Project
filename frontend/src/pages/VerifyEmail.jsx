import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function VerifyEmail() {
  const { token } = useParams();
  const { verifyEmail, error, successMessage, clearMessages, isLoading } = useAuthStore();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    clearMessages();
    
    if (token && !hasFetched) {
      setHasFetched(true);
      verifyEmail(token);
    }
  }, [token, verifyEmail, clearMessages, hasFetched]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black py-10 px-4">
      <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-neutral-800 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Email Verification</h1>
        
        {isLoading && !successMessage && !error && (
          <div className="text-gray-500 dark:text-gray-400">Verifying your email address...</div>
        )}

        {successMessage && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 text-sm border border-green-100">
            {successMessage}
            <div className="mt-4">
              <Link
                to="/login"
                className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block"
              >
                Go to Login
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm border border-red-100">
            {error}
            <div className="mt-4">
              <Link
                to="/login"
                className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
              >
                Return to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
