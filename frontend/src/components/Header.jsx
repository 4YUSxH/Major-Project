import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { User } from "lucide-react";

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="flex items-center justify-end px-8 py-4 bg-gray-50 dark:bg-black transition-colors duration-300 sticky top-0 z-40">
      <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-200 dark:hover:bg-neutral-900 p-2 pr-4 rounded-full transition-colors bg-white dark:bg-[#111111] shadow-sm border border-gray-100 dark:border-neutral-800">
        {user?.profileImage ? (
          <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-neutral-700" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center">
            <User size={20} />
          </div>
        )}
        <div className="flex flex-col text-left">
          <span className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{user?.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</span>
        </div>
      </Link>
    </header>
  );
}
