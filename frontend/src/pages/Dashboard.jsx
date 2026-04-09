import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useTicketStore } from "../store/ticketStore";
import { Ticket, Clock, CheckCircle, Activity } from "lucide-react";
import { Link } from "react-router-dom";

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

  const recentTickets = [...tickets].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5);
  const maxVal = Math.max(openIssues, inProgress, resolved, 1);

  const getStatusColor = (status) => {
    switch(status) {
      case "Open": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "Assigned": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
      case "In Progress": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "Resolved": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "Closed": return "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#111111] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-800 flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Activity Overview</h3>
          <div className="flex-1 flex items-end justify-around gap-4 mt-auto border-b border-gray-100 dark:border-neutral-800 pb-4">
            <div className="flex flex-col items-center gap-2 group w-1/4">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">{openIssues}</span>
              <div 
                className="w-full bg-yellow-400 dark:bg-yellow-500 rounded-t-lg transition-all duration-500 ease-out flex-shrink-0" 
                style={{ height: `${(openIssues / maxVal) * 200}px`, minHeight: '4px' }}
              ></div>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate w-full text-center">Open</span>
            </div>
            <div className="flex flex-col items-center gap-2 group w-1/4">
               <span className="text-sm font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">{inProgress}</span>
               <div 
                 className="w-full bg-purple-400 dark:bg-purple-500 rounded-t-lg transition-all duration-500 ease-out flex-shrink-0" 
                 style={{ height: `${(inProgress / maxVal) * 200}px`, minHeight: '4px' }}
               ></div>
               <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate w-full text-center">In Progress</span>
            </div>
            <div className="flex flex-col items-center gap-2 group w-1/4">
               <span className="text-sm font-bold text-gray-700 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">{resolved}</span>
               <div 
                 className="w-full bg-green-400 dark:bg-green-500 rounded-t-lg transition-all duration-500 ease-out flex-shrink-0" 
                 style={{ height: `${(resolved / maxVal) * 200}px`, minHeight: '4px' }}
               ></div>
               <span className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate w-full text-center">Resolved</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 min-h-[300px] flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Updates</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {recentTickets.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-10">No recent updates to display.</p>
            ) : (
              recentTickets.map(t => (
                <Link to={`/tickets/${t._id}`} key={t._id} className="flex flex-col pb-3 border-b border-gray-50 dark:border-neutral-800/50 last:border-0 hover:bg-slate-50 dark:hover:bg-neutral-800/50 p-2 -mx-2 rounded-lg transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate pr-2">{t.title}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap font-medium ${getStatusColor(t.status)}`}>{t.status}</span>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(t.updatedAt || t.createdAt).toLocaleDateString()}</span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
