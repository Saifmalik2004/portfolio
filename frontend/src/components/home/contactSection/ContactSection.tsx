import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "./ContactForm";
import ContactInfoList, { ContactInfoItem } from "./ContactInfoList";

// Prepare contactInfo data
const contactInfo: ContactInfoItem[] = [
  {
    icon: Mail,
    label: "Email",
    value: "saifmalik7827@gmail.com",
    href: "mailto:saifmalik7827@gmail.com",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "91+7827191775",
    href: "tel:+917827191775",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "New Delhi, India",
    href: "#",
    color: "from-purple-400 to-pink-500",
  },
];

const ContactSection = () => (
  <section id="Contact" className="py-10 bg-white relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-5xl font-bold text-gray-900 mb-4">
          Let's Create Something <span className="text-orange-500">Amazing</span>
        </h2>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <ContactForm />
        <ContactInfoList contactInfo={contactInfo} />
      </div>
    </div>
  </section>
);

export default ContactSection;
