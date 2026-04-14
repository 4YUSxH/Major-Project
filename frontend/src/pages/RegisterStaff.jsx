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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black transition-colors duration-300 py-10 px-4">
      <div className="bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-neutral-800 transition-colors">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Staff / Admin Portal</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Authorized Personnel Registration</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Official Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="staff@university.edu"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Assignment</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="staff">Staff/Faculty</option>
              <option value="admin">System Admin</option>
            </select>
          </div>

          {(formData.role === "staff" || formData.role === "admin") && (
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assigned Department</label>
               <select
                 className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                 value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
               >
                 <option value="">Select Department</option>
                 <option value="Engineering">Engineering</option>
                 <option value="Law">Law</option>
                 <option value="Professional Studies">Professional Studies</option>
                 <option value="Pharmacy">Pharmacy</option>
                 <option value="Administration">Administration</option>
               </select>
             </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors flex justify-center items-center mt-4 shadow-sm"
          >
            {isLoading ? "Provisioning..." : "Create Official Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already authorized? <Link to="/login" className="text-primary-600 dark:text-primary-400 font-medium hover:underline">Sign In Here</Link>
        </div>
      </div>
    </div>
  );
}
