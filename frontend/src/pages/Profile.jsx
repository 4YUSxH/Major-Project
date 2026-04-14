import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { UserCircle, ArrowLeft } from "lucide-react";

export default function Profile() {
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

  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
      window.location.reload(); // Refresh to bypass any stale context
    }
  };

  const isStudent = user?.role === "student";

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Profile</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and edit your personal information.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/40 dark:text-primary-400 py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 p-8">
        <div className="text-center mb-8">
          {user?.profileImage ? (
            <img src={user.profileImage} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-50 dark:border-neutral-800 mx-auto mb-4" />
          ) : (
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserCircle size={48} />
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
          <p className="text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
              <select
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
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
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
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
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
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
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
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
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none disabled:opacity-75 disabled:cursor-not-allowed"
                    value={formData.enrollmentNumber}
                    onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
                    placeholder="e.g. 052410"
                  />
                </div>
              </>
            )}
            {isEditing && (
              <div className="md:col-span-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image URL</label>
                 <input
                   type="text"
                   className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-800/50 border border-transparent dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white outline-none"
                   value={formData.profileImage}
                   onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                   placeholder="https://example.com/image.jpg"
                 />
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
