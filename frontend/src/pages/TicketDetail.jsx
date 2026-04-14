import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTicketStore } from "../store/ticketStore";
import { useAuthStore } from "../store/authStore";
import { ArrowLeft, Send, RotateCcw } from "lucide-react";
import io from "socket.io-client";

let socket;

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchTicket, currentTicket, messages, addMessage, updateTicket, socketUpdateTicket, socketAddMessage, isLoading } = useTicketStore();
  const { user } = useAuthStore();
  const [reply, setReply] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [pendingAssignedTo, setPendingAssignedTo] = useState("");

  useEffect(() => {
    if (currentTicket) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingStatus(currentTicket.status);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPendingAssignedTo(currentTicket.assignedTo?._id || currentTicket.assignedTo || "");
    }
  }, [currentTicket]);

  useEffect(() => {
    fetchTicket(id);

    if (user?.role === "admin") {
      import("../utils/axios").then(({ default: axios }) => {
        axios.get('/auth/staff').then(res => setStaffList(res.data));
      });
    }

    // Socket Initialization
    socket = io("http://localhost:5000");
    socket.emit("join-ticket", id);

    socket.on("new-message", (msg) => {
      socketAddMessage(msg);
    });

    socket.on("ticket-updated", (updatedTicket) => {
      socketUpdateTicket(updatedTicket);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, fetchTicket, socketAddMessage, socketUpdateTicket]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    await addMessage(id, reply);
    setReply("");
  };

  if (isLoading || !currentTicket) return <div className="p-8 text-center text-gray-500">Loading details...</div>;

  const isStaff = user?.role === "staff" || user?.role === "admin";
  const isTicketOwner = user?.role === "student" && currentTicket.student?._id === user._id;
  const canReopen = isTicketOwner && ["Closed", "Resolved"].includes(currentTicket.status);

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6">
        <ArrowLeft size={16} /> Back to Tickets
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{currentTicket.title}</h1>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                {currentTicket.status}
              </span>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">{currentTicket.description}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Discussion</h3>
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender._id === user._id ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender._id === user._id ? "bg-primary-600 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none"}`}>
                    <p className="text-xs font-medium mb-1 opacity-70">
                      {msg.sender.name} {msg.sender.role === 'staff' && '(Support)'}
                    </p>
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleReply} className="flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="Type a message..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
              />
              <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2">
                <Send size={18} /> Send
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ticket Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Requester</span>
                <span className="font-medium">{currentTicket.student?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{currentTicket.category}</span>
              </div>
              <div className="flex justify-between border-b pb-2 mt-2">
                <span className="text-gray-500">Department</span>
                <span className="font-medium">{currentTicket.department || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Priority</span>
                <span className="font-medium text-red-600">{currentTicket.priority}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">{new Date(currentTicket.createdAt).toLocaleDateString()}</span>
              </div>
              {currentTicket.assignedTo && (
                <div className="flex justify-between pb-2 border-t pt-2 mt-2 border-gray-100">
                  <span className="text-gray-500">Assigned To</span>
                  <span className="font-medium text-primary-600 dark:text-primary-400">{currentTicket.assignedTo.name}</span>
                </div>
              )}
            </div>

            {canReopen && (
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-neutral-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Not satisfied with the resolution? You can reopen this ticket.
                </p>
                <button
                  onClick={() => updateTicket(id, { status: "Open" })}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  <RotateCcw size={15} />
                  Reopen Ticket
                </button>
              </div>
            )}

            {isStaff && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Update Status</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-900"
                      value={pendingStatus}
                      onChange={(e) => setPendingStatus(e.target.value)}
                    >
                      <option value="Open">Open</option>
                      <option value="Assigned">Assigned</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {user?.role === "admin" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Assign To Staff</label>
                      <select
                        className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-800 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white dark:bg-neutral-900"
                        value={pendingAssignedTo}
                        onChange={(e) => setPendingAssignedTo(e.target.value)}
                      >
                        <option value="">Unassigned</option>
                        {staffList
                          .filter((staff) => staff.department === currentTicket.department)
                          .map((staff) => (
                            <option key={staff._id} value={staff._id}>
                              {staff.name} ({staff.department || "No Dept"})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <button
                    onClick={() => updateTicket(id, { status: pendingStatus, assignedTo: pendingAssignedTo || null })}
                    disabled={
                      pendingStatus === currentTicket.status &&
                      pendingAssignedTo === (currentTicket.assignedTo?._id || currentTicket.assignedTo || "")
                    }
                    className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium mt-2"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
