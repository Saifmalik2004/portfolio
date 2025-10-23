import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Mail } from 'lucide-react';

const Footer = () => {
 

  const socialLinks = [
    { icon: Github, href: 'https://github.com/Saifmalik2004', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/saif-malik7827/', label: 'LinkedIn' },
    { icon: Instagram, href: 'https://www.instagram.com/the_lucifer_morningstarr', label: 'Instagram' },
    { icon: Mail, href: 'mailto:saifmalik7827@gmail.com', label: 'Email' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Let's Connect
            </h3>
            <p className="text-gray-600">Building amazing digital experiences</p>
          </div>

          <div className="flex space-x-6">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.2, rotateY: 180 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-gray-200 text-black rounded-full hover:bg-orange-500 hover:text-white transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Portfolio. All rights reserved.
          </p>
          
        
        </div>
      </div>
    </footer>
  );
};

export default Footer;