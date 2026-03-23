import { motion } from "framer-motion";

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center p-4 bg-grain">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo via-indigo-light to-indigo-dark" />
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-heading mb-2 text-white">Cortex</h1>
          <p className="text-gray-400 font-mono text-sm">{subtitle}</p>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
