import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useTicketStore } from "../store/ticketStore";
import { Ticket, Clock, CheckCircle, Activity } from "lucide-react";
// In a full version, we could import Chart.js/Recharts here

export default function Dashboard() {
  const { user } = useAuthStore();
  const { tickets, fetchTickets, isLoading } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const totalTickets = tickets.length;
  const openIssues = tickets.filter(t => t.status === "Open" || t.status === "Assigned").length;
  const inProgress = tickets.filter(t => t.status === "In Progress").length;
  const resolved = tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length;

  const stats = [
    { title: "Total Tickets", value: isLoading ? "..." : totalTickets.toString(), icon: Ticket, color: "bg-blue-500" },
    { title: "Open Issues", value: isLoading ? "..." : openIssues.toString(), icon: Activity, color: "bg-yellow-500" },
    { title: "In Progress", value: isLoading ? "..." : inProgress.toString(), icon: Clock, color: "bg-purple-500" },
    { title: "Resolved", value: isLoading ? "..." : resolved.toString(), icon: CheckCircle, color: "bg-green-500" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Activity Chart Placeholder</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex items-center justify-center">
          <p className="text-gray-400">Recent Updates Placeholder</p>
        </div>
      </div>
    </div>
  );
}
