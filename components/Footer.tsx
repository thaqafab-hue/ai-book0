import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

// Simple footer component
// مكون تذييل بسيط
const Footer: React.FC = () => {
  return (
    <footer className="bg-black/30 backdrop-blur-sm mt-8 py-6">
      <div className="container mx-auto px-4 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} AI Book. جميع الحقوق محفوظة.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-purple-400 transition-colors"><Github size={20} /></a>
          <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
          <a href="#" className="hover:text-purple-400 transition-colors"><Linkedin size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;