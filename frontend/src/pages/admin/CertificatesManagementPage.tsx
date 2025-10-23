import CertificateList from "@/components/admin/certificate/CertificateList";
import CertificateModal from "@/components/admin/certificate/CertificateModal";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Certificate } from "@/types/certificate";
import certificateService from"../../services/certificateService"
import { useState, useEffect, useRef } from "react";
// Reuse ConfirmModal

type ViewMode = "list" | "add" | "edit";

const CertificateManagement = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
   const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [certificateToDelete, setCertificateToDelete] = useState<number | null>(null);
  const hasFetched = useRef(false);

  const fetchCertificates = async () => {
    setIsFetching(true);
    try {
      const data = await certificateService.getAllCertificates();
      setCertificates(data);
      setError(null);
      hasFetched.current = true;
    } catch (err) {
      setError("Failed to fetch certificates. Please try again.");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!hasFetched.current && certificates.length === 0) {
      fetchCertificates();
    }
  }, []);

  const handleAddCertificate = () => {
    setSelectedCertificate(null);
    setViewMode("add");
  };

  const handleEditCertificate = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setViewMode("edit");
  };

  const handleDeleteCertificate = (certificateId: number) => {
    setCertificateToDelete(certificateId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (certificateToDelete === null) return;
    setIsDeleting(certificateToDelete);
    try {
      await certificateService.deleteCertificate(certificateToDelete);
      setCertificates((prev) => prev.filter((c) => c.id !== certificateToDelete));
      setError(null);
    } catch (err) {
      setError("Failed to delete certificate. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false);
      setCertificateToDelete(null);
    }
  };

  const handleSaveCertificate = async (certificateData: Certificate) => {
    setIsSaving(true);
    try {
      if (selectedCertificate?.id) {
        const response = await certificateService.updateCertificate(selectedCertificate.id, certificateData);
        setCertificates((prev) =>
          prev.map((c) => (c.id === selectedCertificate.id ? response : c))
        );
      } else {
        const response = await certificateService.createCertificate(certificateData);
        setCertificates((prev) => [response, ...prev]);
      }
      setViewMode("list");
      setSelectedCertificate(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save certificate. Please check for duplicates or invalid data.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setViewMode("list");
    setSelectedCertificate(null);
    setError(null);
  };

  const handleRefresh = () => {
    hasFetched.current = false;
    setCertificates([]);
    fetchCertificates();
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      {viewMode === "list" && (
        <CertificateList
          certificates={certificates}
            searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isFetching={isFetching}
          error={error}
          isSaving={isSaving}
          isDeleting={isDeleting}
          onEdit={handleEditCertificate}
          onDelete={handleDeleteCertificate}
          onRefresh={handleRefresh}
          onAdd={handleAddCertificate}
        />
      )}
      {(viewMode === "add" || viewMode === "edit") && (
        <CertificateModal
          certificate={selectedCertificate}
          onSave={handleSaveCertificate}
          onClose={handleCloseModal}
          isSaving={isSaving}
          error={error}
        />
      )}
      <ConfirmModal
        title="Delete Certificate"
        description="Are you sure you want to delete this certificate? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        trigger={null}
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
      />
    </div>
  );
};

export default CertificateManagement;
