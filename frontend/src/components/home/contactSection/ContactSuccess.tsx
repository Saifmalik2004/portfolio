import { motion } from "framer-motion";
import { Heart } from "lucide-react";


const SuccessMessage = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3"
  >
    <Heart className="text-green-500" size={20} />
    <p className="text-green-700 font-medium">
      Message sent successfully! I'll be in touch soon.
    </p>
  </motion.div>
);

export default SuccessMessage;
