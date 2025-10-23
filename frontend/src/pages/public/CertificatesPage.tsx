import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { Certificate } from "../../types/certificate";
import certificateService from "../../services/certificateService";

const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async () => {
    setIsFetching(true);
    try {
      const data = await certificateService.getAllCertificates();
      setCertificates(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch certificates. Please try again.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Certificates & <span className="text-gray-600">Credentials</span>
          </h1>
        </div>

        {/* Error */}
        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isFetching
            ? // Skeletons
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/70 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm animate-pulse"
                >
                  <div className="w-full h-32 bg-gray-200 rounded-t-2xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex justify-between items-center mt-4">
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-10"></div>
                    </div>
                  </div>
                </div>
              ))
            : // Real Cards
              certificates.map((cert) => (
                <motion.div
                  key={cert.id}
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white/70 backdrop-blur-xl rounded-2xl border border-gray-200 
                             hover:shadow-[0_10px_32px_-4px_rgba(0,0,0,0.15)]
                             transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={cert.mediaUrl}
                      alt={cert.title}
                      className="w-full h-32 object-cover rounded-t-2xl"
                    />

                    {/* Award icon */}
                    <div className="absolute top-3 left-3 p-1.5 bg-white/70
                                    backdrop-blur-md rounded-full border border-gray-200">
                      <Award size={16} className="text-gray-700" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {cert.issuedOrganisation}
                    </p>

                    <div className="flex items-center space-x-2 text-gray-500 text-xs mb-3">
                      <Calendar size={12} />
                      <span>
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Credential ID</p>
                        <p className="text-xs text-gray-700 font-mono">
                          {cert.credentialId}
                        </p>
                      </div>
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-gray-700 hover:text-black text-xs font-medium transition-colors"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Verify
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CertificatesPage;
