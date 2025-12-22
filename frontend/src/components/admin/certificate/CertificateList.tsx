import React from "react";
import { Search, Plus, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Certificate } from "@/types/certificate";
import CertificateCard from "./CertificateCard";
import SkeletonCertificateCard from "./CertificateSkeletonCard";

interface CertificateListProps {
  certificates?: Certificate[];
  renderCertificates?: Certificate[];
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
  renderCertificates,
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
  const list = renderCertificates ?? certificates ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Certificate Management
          </h2>
          <p className="text-gray-600 text-sm">
            Create, edit, and manage your certificates
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isFetching}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>

          <Button
            onClick={onAdd}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search certificates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              disabled={isFetching}
            />
          </div>
        </CardContent>
      </Card>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetching ? (
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCertificateCard key={i} />
          ))
        ) : list.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4 h-12 w-12" />
            <h3 className="text-lg font-semibold text-gray-900">
              No certificates found
            </h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        ) : (
          list.map((cert) => (
            <CertificateCard
              key={cert.id}
              certificate={cert}
              onEdit={onEdit}
              onDelete={onDelete}
              isSaving={isSaving}
              isDeleting={isDeleting}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CertificateList;
