import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <motion.main 
        className="flex-1 container mx-auto px-4 py-6 md:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          © 2025 Трекер Привычек. Все права защищены.
        </div>
      </footer>
    </div>
  );
};

export default Layout;