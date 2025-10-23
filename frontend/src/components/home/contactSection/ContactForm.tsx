import type React from "react";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Zap } from "lucide-react";
import SuccessMessage from "./ContactSuccess";
import contactService from "@/services/contactService"; // ✅ import service
import { ContactRequest } from "@/types/contact";

export interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Map frontend fields -> backend ContactRequest
      const payload: ContactRequest = {
        fullName: data.name,
        email: data.email,
        message: data.message, // ✅ subject + message merge
      };

      await contactService.createContact(payload);

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (error) {
      console.error(error);
      setErrorMsg("❌ Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-blue-50/50 rounded-3xl" />
        <div className="relative z-10">
          {isSubmitted && <SuccessMessage />}
          {errorMsg && <p className="text-red-500 mb-4">{errorMsg}</p>}

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
              <textarea
                {...register("message", { required: "Message is required" })}
                rows={6}
                placeholder="Tell me about your project..."
                className="w-full px-6 py-4 bg-white/70 backdrop-blur-sm border-2 border-gray-100 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all duration-300 resize-none"
              />
              {errors.message && <p className="text-red-500 text-sm mt-2">{errors.message.message}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl py-4 px-8 font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
