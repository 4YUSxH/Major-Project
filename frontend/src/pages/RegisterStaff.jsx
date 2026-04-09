import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterStaff() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "staff", department: "" });
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData);
    const { user } = useAuthStore.getState();
    if (user) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 border-t-8 border-t-indigo-600">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Staff Portal Setup</h1>
          <p className="text-gray-500 mt-2">Administrator & Teacher Registration</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Prof. Jane Doe"
              value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Email</label>
            <input
              type="email" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="faculty@university.edu"
              value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="••••••••"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="staff">Staff/Teacher</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {(formData.role === "staff" || formData.role === "admin") && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Department</label>
               <select
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                 value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
               >
                 <option value="">Select Department</option>
                 <option value="IT">IT Support</option>
                 <option value="Admin">Administration</option>
                 <option value="Academic">Academic</option>
               </select>
             </div>
          )}

          <button
            type="submit" disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-4"
          >
            {isLoading ? "Authenticating..." : "Create Authority Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already registered? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
}
