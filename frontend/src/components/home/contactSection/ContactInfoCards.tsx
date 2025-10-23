import React from "react";
import { motion } from "framer-motion";
import { ContactInfoItem } from "./ContactInfoList";

interface InfoCardProps extends ContactInfoItem {
  index: number;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  label,
  value,
  href,
  color,
  index,
}) => (
  <motion.a
    href={href}
    whileHover={{ scale: 1.05, x: 10 }}
    className="flex items-center space-x-6 p-6 bg-white/80 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group"
  >
    <div className={`p-4 bg-gradient-to-r ${color} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-lg text-gray-900 font-semibold group-hover:text-orange-600 transition-colors">
        {value}
      </p>
    </div>
  </motion.a>
);

export default InfoCard;
