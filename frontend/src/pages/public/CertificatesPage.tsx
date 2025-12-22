import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { Certificate } from "../../types/certificate";
import { PaginatedResponse } from "@/types/paginatedReponse";
import certificateService from "../../services/certificateService";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 6;

const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCertificates = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const data: PaginatedResponse<Certificate> =
        await certificateService.getPaginatedCertificates(pageNumber, PAGE_SIZE);

      setCertificates(data.content);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError("Failed to fetch certificates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates(currentPage);
  }, [currentPage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-12">
          Certificates & Credentials
        </h1>

        {error && <p className="text-center text-red-500">{error}</p>}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <motion.div
              key={cert.id}
              whileHover={{ y: -6, scale: 1.02 }}
              className="bg-white rounded-2xl border shadow-sm"
            >
              <img
                src={cert.mediaUrl}
                alt={cert.title}
                className="w-full h-32 object-cover rounded-t-2xl"
              />

              <div className="p-5">
                <h3 className="font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.issuedOrganisation}</p>

                <div className="flex items-center text-xs text-gray-500 mt-2">
                  <Calendar size={12} className="mr-1" />
                  {new Date(cert.issueDate).toLocaleDateString()}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs font-mono">{cert.credentialId}</span>

                  <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-xs flex items-center">
                    <ExternalLink size={14} className="mr-1" />
                    Verify
                  </a>
                </div>
              </div>
            </motion.div>
          ))}

          {/* SKELETON */}
          {loading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
            ))}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <Pagination className="mt-12 text-black">
            <PaginationContent className="justify-center">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 0))}
                  aria-disabled={currentPage === 0}
                  className={currentPage === 0 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i)}
                    isActive={currentPage === i}
                    className={currentPage === i ? "bg-orange-500 text-white hover:bg-orange-600" : "hover:bg-gray-100"}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1))}
                  aria-disabled={currentPage === totalPages - 1}
                  className={currentPage === totalPages - 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </motion.div>
  );
};

export default CertificatesPage;
