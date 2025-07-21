import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { motion } from "framer-motion";
import { Send, Zap } from "lucide-react";
import SuccessMessage from "./ContactSuccess";

export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <motion.div
      initial={{ x: -50, opacity: 0 }}
      whileInView={{ x: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-blue-50/50 rounded-3xl" />
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
              <Send size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Send Message</h3>
              <p className="text-gray-600">I'll get back to you within 24 hours</p>
            </div>
          </div>

          {isSubmitted && <SuccessMessage />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  {...register("name", { required: "Name is required" })}
                  placeholder="Your Name"
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                />
                {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name.message}</p>}
              </div>
              <div className="relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
                />
                {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>}
              </div>
            </div>
            <div className="relative">
              <input
                {...register("subject", { required: "Subject is required" })}
                placeholder="Project Subject"
                className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300"
              />
              {errors.subject && <p className="text-red-500 text-sm mt-2">{errors.subject.message}</p>}
            </div>
            <div className="relative">
              <textarea
                {...register("message", { required: "Message is required" })}
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none"
              />
              {errors.message && <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>}
            </div>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl py-4 px-8 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                    />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </div>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactForm;
