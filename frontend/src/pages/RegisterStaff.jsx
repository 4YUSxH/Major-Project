import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeOff, Trash2, UserPlus, Users } from "lucide-react";

export default function RegisterStaff() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "staff", department: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { addStaff, fetchStaff, deleteStaff, staffList, isLoading, error, successMessage, clearMessages } = useAuthStore();

  useEffect(() => {
    clearMessages();
    fetchStaff();
  }, [clearMessages, fetchStaff]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await addStaff(formData);
    if (success) {
      setFormData({ name: "", email: "", password: "", role: "staff", department: "" });
      fetchStaff(); // Refresh the list
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to revoke credentials for this staff member?")) {
      await deleteStaff(id);
    }
  };

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Staff List */}
        <div className="flex-1 bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
            <Users className="text-primary-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Active Staff & Admins</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 dark:border-neutral-800">
                  <th className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Email</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Role/Dept</th>
                  <th className="py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {(!staffList || staffList.length === 0) ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No staff members found.
                    </td>
                  </tr>
                ) : (
                  staffList.map((staff) => (
                    <tr key={staff._id} className="border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors">
                      <td className="py-3 px-4 text-sm dark:text-gray-200">{staff.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">{staff.email}</td>
                      <td className="py-3 px-4 text-sm dark:text-gray-200 capitalize">
                        {staff.role} {staff.department && `- ${staff.department}`}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(staff._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                          title="Revoke Credentials"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Add Staff Form */}
        <div className="w-full md:w-[400px] shrink-0 bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
            <UserPlus className="text-primary-500" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Provision Account</h2>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 bg-white dark:bg-black text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all pr-10"
                  placeholder="••••••••"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

        </div>
      </div>
    </div>
  );
}
