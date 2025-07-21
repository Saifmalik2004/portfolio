import React from "react";
import { motion } from "framer-motion";
import InfoCard from "./ContactInfoCards";

export interface ContactInfoItem {
  icon: React.ElementType;
  label: string;
  value: string;
  href: string;
  color: string;
}

interface ContactInfoListProps {
  contactInfo: ContactInfoItem[];
}

const ContactInfoList: React.FC<ContactInfoListProps> = ({ contactInfo }) => (
  <motion.div
    initial={{ x: 50, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: 0.5 }}
    className="space-y-8"
  >
    <div className="space-y-6">
      {contactInfo.map((item, i) => (
        <InfoCard key={item.label} {...item} index={i} />
      ))}
    </div>
  </motion.div>
);

export default ContactInfoList;
