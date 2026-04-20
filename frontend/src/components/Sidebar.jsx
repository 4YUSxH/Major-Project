import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Ticket, BookOpen, LogOut, Bell, CheckCircle, Moon, Sun, Megaphone, UserPlus } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useThemeStore } from "../store/themeStore";
import { useNotificationStore } from "../store/notificationStore";
import io from "socket.io-client";

let socket;

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, addLiveNotification } = useNotificationStore();
  
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      socket = io("http://localhost:5000");
      socket.on(`notification-${user._id}`, (notification) => {
        addLiveNotification(notification);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [user, fetchNotifications, addLiveNotification]);

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Tickets", path: "/tickets", icon: Ticket },
    { name: "Notice Board", path: "/announcements", icon: Megaphone },
    { name: "Knowledge Base", path: "/kb", icon: BookOpen },
  ];

  if (user?.role === "admin") {
    links.push({ name: "Add Staff/Admin", path: "/admin/add-staff", icon: UserPlus });
  }

  return (
    <aside className="w-64 bg-slate-900 dark:bg-[#0a0a0a] dark:border-r dark:border-neutral-800 h-screen sticky top-0 text-slate-300 flex flex-col z-50 transition-colors duration-300">
      <div className="p-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Ticket className="text-primary-500" /> HelpDesk
        </h2>
        
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full hover:bg-slate-800 transition-colors relative"
          >
            <Bell size={20} className="text-slate-300 hover:text-white" />
            {unreadCount > 0 && (
               <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right">
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{unreadCount} new</span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-500">No notifications yet.</p>
                ) : (
                  notifications.map(note => (
                    <div 
                      key={note._id} 
                      className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left ${!note.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <p className="text-sm text-gray-800 mb-2">{note.message}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400">{new Date(note.createdAt).toLocaleDateString()}</span>
                        {!note.isRead && (
                          <button 
                             onClick={() => markAsRead(note._id)}
                             className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
                          >
                            <CheckCircle size={12} /> Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || (location.pathname.startsWith('/tickets') && link.path === '/tickets');
          
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-500/30" 
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-slate-800 p-4 rounded-xl flex items-center justify-between mb-4">
          <div className="truncate">
            <p className="text-sm font-medium text-white block truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role} {user?.department && `- ${user.department}`}</p>
          </div>
          <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-white transition-colors ml-2 bg-slate-700/50 rounded-lg hover:bg-slate-700">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
