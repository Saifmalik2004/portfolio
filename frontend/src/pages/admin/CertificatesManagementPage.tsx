import { useEffect, useState } from "react";
import CertificateList from "@/components/admin/certificate/CertificateList";
import CertificateModal from "@/components/admin/certificate/CertificateModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Certificate } from "@/types/certificate";
import { PaginatedResponse } from "@/types/paginatedReponse";
import certificateService from "@/services/certificateService";

type ViewMode = "list" | "add" | "edit";

const PAGE_SIZE = 9;

const CertificateManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedCertificate, setSelectedCertificate] =
    useState<Certificate | null>(null);

  const [pageData, setPageData] = useState<PaginatedResponse<Certificate>>({
    content: [],
    page: 0,
    size: PAGE_SIZE,
    totalElements: 0,
    totalPages: 0,
    last: true,
  });

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] =
    useState<number | null>(null);

  // ---------------- FETCH ----------------
  const fetchCertificates = async (page = 0) => {
    setIsFetching(true);
    try {
      const data = await certificateService.getPaginatedCertificates(
        page,
        PAGE_SIZE
      );
      setPageData(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch certificates");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchCertificates(currentPage);
  }, [currentPage]);

  // ---------------- CRUD ----------------
  const handleAdd = () => {
    setSelectedCertificate(null);
    setViewMode("add");
  };

  const handleEdit = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setViewMode("edit");
  };

  const handleDelete = (id: number) => {
    setCertificateToDelete(id);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (certificateToDelete === null) return;

    setIsDeleting(certificateToDelete);
    try {
      await certificateService.deleteCertificate(certificateToDelete);
      fetchCertificates(currentPage);
    } catch (err) {
      setError("Failed to delete certificate");
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false);
      setCertificateToDelete(null);
    }
  };

  const handleSave = async (data: Certificate) => {
    setIsSaving(true);
    try {
      if (selectedCertificate && selectedCertificate.id != null) {
        await certificateService.updateCertificate(selectedCertificate.id, data);
      } else {
        await certificateService.createCertificate(data);
      }
      fetchCertificates(0);
      setViewMode("list");
    } catch (err: any) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  // ---------------- SEARCH (client-side on current page) ----------------
  const filteredCertificates = pageData.content.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {viewMode === "list" && (
        <>
          <CertificateList
            renderCertificates={filteredCertificates}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFetching={isFetching}
            error={error}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onRefresh={() => fetchCertificates(currentPage)}
          />

          {pageData.totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent className="justify-center">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((p) => Math.max(p - 1, 0))
                    }
                    className={
                      currentPage === 0
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>

                {[...Array(pageData.totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i)}
                      isActive={currentPage === i}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((p) =>
                        Math.min(p + 1, pageData.totalPages - 1)
                      )
                    }
                    className={
                      currentPage === pageData.totalPages - 1
                        ? "opacity-50 pointer-events-none"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {(viewMode === "add" || viewMode === "edit") && (
        <CertificateModal
          certificate={selectedCertificate}
          onSave={handleSave}
          onClose={() => setViewMode("list")}
          isSaving={isSaving}
          error={error}
        />
      )}

      <ConfirmModal
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate?"
        confirmText="Delete"
        cancelText="Cancel"
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={confirmDelete}
        trigger={null}
      />
    </div>
  );
};

export default CertificateManagement;
