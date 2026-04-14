import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }) {
  return (
    <div className="flex bg-gray-50 dark:bg-black min-h-screen transition-colors duration-300">
      <Sidebar />
      <main className="flex-1 overflow-x-hidden flex flex-col relative w-full">
        <Header />
        <div className="p-8 w-full max-w-7xl mx-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
