import { useState } from "react";
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function CreateTicket() {
  const [formData, setFormData] = useState({ title: "", description: "", category: "", department: "", priority: "" });
  const { createTicket, isLoading } = useTicketStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await createTicket(formData);
    if (success) navigate("/tickets");
  };

  const { user } = useAuthStore();
  if (user?.role !== "student") {
    return (
      <div className="p-12 text-center max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-500 mt-2 mb-6">Staff and Administrators are not permitted to raise tickets.</p>
        <button onClick={() => navigate(-1)} className="text-primary-600 font-medium hover:underline flex items-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4">
          <ArrowLeft size={16} /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Create New Ticket</h1>
        <p className="text-gray-500 mt-1">Please provide details about your issue.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Brief description of the issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="Detailed explanation..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="" disabled>Select Category</option>
                <option value="IT Support">IT Support</option>
                <option value="Academic">Academic</option>
                <option value="Bus Service">Bus Service</option>
                <option value="Facility Maintenance">Facility Maintenance</option>
                <option value="Financial">Financial/Fees</option>
                <option value="Library">Library</option>
                <option value="Disciplinary">Disciplinary</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Department</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="" disabled>Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-lg transition-colors flex justify-center items-center mt-4"
          >
            {isLoading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
