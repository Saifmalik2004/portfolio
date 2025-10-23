import React from "react";
import { Search, Plus, RefreshCw } from "lucide-react";
import { Certificate } from "../../../types/certificate";
import CertificateCard from "./CertificateCard";
import SkeletonCertificateCard from "./CertificateSkeletonCard";

interface CertificateListProps {
  certificates: Certificate[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFetching: boolean;
  error: string | null;
  isSaving: boolean;
  isDeleting: number | null;
  onEdit: (certificate: Certificate) => void;
  onDelete: (id: number) => void;
  onRefresh: () => void;
  onAdd: () => void;
}

const CertificateList: React.FC<CertificateListProps> = ({
  certificates,
  searchTerm,
  setSearchTerm,
  isFetching,
  error,
  isSaving,
  isDeleting,
  onEdit,
  onDelete,
  onRefresh,
  onAdd,
}) => {
  const filteredCertificates = certificates.filter((cert) =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Certificate Management</h2>
          <p className="text-gray-600">Create, edit, and manage your certificates</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefresh}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
            disabled={isFetching}
          >
            <RefreshCw size={20} />
            <span>Refresh</span>
          </button>
          <button
            onClick={onAdd}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-lg"
            disabled={isSaving}
          >
            <Plus size={20} />
            <span>Add New Certificate</span>
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
            disabled={isFetching}
          />
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCertificateCard key={i} />)
          : filteredCertificates.length === 0
          ? (
            <div className="text-center py-12 col-span-full">
              <Search size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No certificates found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )
          : filteredCertificates.map((cert) => (
              <CertificateCard
                key={cert.id}
                certificate={cert}
                onEdit={onEdit}
                onDelete={onDelete}
                isSaving={isSaving}
                isDeleting={isDeleting}
              />
            ))}
      </div>
    </div>
  );
};

export default CertificateList;
