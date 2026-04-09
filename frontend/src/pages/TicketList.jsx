import { useEffect } from "react";
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function TicketList() {
  const { tickets, fetchTickets, isLoading } = useTicketStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const getStatusColor = (status) => {
    switch(status) {
      case "Open": return "bg-blue-100 text-blue-800";
      case "Assigned": return "bg-indigo-100 text-indigo-800";
      case "In Progress": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 mt-1">Manage and track your support requests</p>
        </div>
        {user?.role === "student" && (
          <Link to="/tickets/new" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
            <Plus size={20} />
            <span>New Ticket</span>
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center">
             <p className="text-gray-500 mb-4">No tickets found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-semibold text-sm text-gray-600">Ticket Details</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600">Status</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600">Priority</th>
                <th className="px-6 py-4 font-semibold text-sm text-gray-600">Created</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link to={`/tickets/${ticket._id}`} className="block">
                      <p className="font-semibold text-gray-900 mb-1">{ticket.title}</p>
                      <p className="text-sm text-gray-500 truncate max-w-md">{ticket.description}</p>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-700">{ticket.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
