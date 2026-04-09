import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden">
        {/* Top header could go here if needed */}
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
