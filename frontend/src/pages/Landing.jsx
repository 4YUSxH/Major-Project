import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Ticket, Zap, Shield, Globe, ArrowRight, Sun, Moon } from "lucide-react";
import { useThemeStore } from "../store/themeStore";

export default function Landing() {
  const { theme, toggleTheme } = useThemeStore();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const featureCards = [
    { icon: Ticket, title: "Modern Ticketing", desc: "Instantly create, track, and resolve campus-related affairs natively." },
    { icon: Zap, title: "Lightning Fast", desc: "Real-time socket driven updates keeps you synced instantly without refreshing." },
    { icon: Shield, title: "Campus Secured", desc: "Built with tight role-based security protecting university confidentiality." },
    { icon: Globe, title: "Global Board", desc: "Access official campus-wide announcements dynamically via the Notice Board." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black text-gray-900 dark:text-gray-100 flex flex-col font-sans overflow-hidden transition-colors duration-300">
      {/* Navbar overlay */}
      <nav className="w-full py-6 px-10 flex justify-between items-center z-50">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <div className="bg-primary-600 p-2 rounded-xl text-white">
            <Ticket size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">HelpDesk</span>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <button onClick={toggleTheme} className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-white dark:bg-[#111111] rounded-lg border border-gray-200 dark:border-neutral-800 shadow-sm">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link to="/login" className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="px-5 py-2.5 rounded-lg text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white transition-colors shadow-sm">Sign Up</Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 relative z-10">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/20 rounded-full blur-[120px] pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl w-full text-center relative"
        >
          <motion.div variants={itemVariants} className="mb-6 flex justify-center">
            <span className="bg-white dark:bg-[#111111] border border-gray-200 dark:border-neutral-800 text-primary-600 dark:text-primary-400 text-xs font-semibold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
              Chameli Devi Group Of Institutions
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants} 
            className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight"
          >
            Resolution is just <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-600">one ticket away.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants} 
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            A premium, high-contrast support portal designed exclusively to route academics, infrastructure, and administrative requests with unparalleled speed.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/30"
              >
                Access Portal <ArrowRight size={20} />
              </motion.button>
            </Link>
            <Link to="/kb">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#111111] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-neutral-800 rounded-xl font-bold text-lg hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors shadow-sm"
              >
                Knowledge Base
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-32 mb-20"
        >
          {featureCards.map((card, idx) => (
            <motion.div 
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10, borderColor: "rgba(59, 130, 246, 0.4)" }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 shadow-sm p-8 rounded-2xl flex flex-col items-center text-center transition-colors group"
            >
              <div className="w-14 h-14 bg-gray-50 dark:bg-[#111111] border border-gray-100 dark:border-neutral-800 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/30 group-hover:border-primary-200 dark:group-hover:border-primary-500/50 rounded-2xl flex items-center justify-center mb-6 transition-colors">
                <card.icon size={28} className="text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-500 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
