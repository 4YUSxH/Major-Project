import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { UserCircle } from "lucide-react";

export default function ProfileSetup() {
  const { user, updateProfile, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    department: user?.department || "",
    branch: user?.branch || "",
    semester: user?.semester || "",
    year: user?.year || "",
    enrollmentNumber: user?.enrollmentNumber || "",
    profileImage: user?.profileImage || "",
  });

  useEffect(() => {
    if (user?.hasSetupProfile) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      navigate("/dashboard");
      window.location.reload(); // Refresh to bypass any stale context
    }
  };

  const isStudent = user?.role === "student";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-[#111111] rounded-2xl shadow-xl border border-gray-100 dark:border-neutral-800 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <UserCircle size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Please provide these mandatory details to proceed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select
                required
                className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="" disabled>Select Department</option>
                <option value="Engineering">Engineering</option>
                <option value="Law">Law</option>
                <option value="Professional Studies">Professional Studies</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Administration">Administration</option>
              </select>
            </div>

            {isStudent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Branch</label>
                  <select
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  >
                    <option value="" disabled>Select Branch</option>
                    <option value="IT">IT</option>
                    <option value="ME">ME</option>
                    <option value="EC">EC</option>
                    <option value="Civil">Civil</option>
                    <option value="CSIT">CSIT</option>
                    <option value="AIDS">AIDS</option>
                    <option value="AIML">AIML</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    placeholder="e.g. 3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enrollment Number</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                    placeholder="e.g. 052410"
                  />
                </div>
              </>
            )}
            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL (Optional)</label>
               <input
                 type="text"
                 className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                 value={formData.profileImage}
                 onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                 placeholder="https://example.com/image.jpg"
               />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center mt-6"
          >
            {isLoading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
