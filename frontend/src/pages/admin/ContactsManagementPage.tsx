import ContactList from "@/components/admin/contact/ContactList";
import { ConfirmModal } from "@/components/ConfirmModal";
import contactService from "@/services/contactService";
import { ContactResponse } from "@/types/contact";
import { useState, useEffect, useRef } from "react";


type FilterMode = "all" | "unread";

const ContactManagement = () => {
  const [contacts, setContacts] = useState<ContactResponse[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isMarking, setIsMarking] = useState<number | null>(null);
  const [isMarkingAll, setIsMarkingAll] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<number | null>(null);
  const hasFetched = useRef(false);

  const fetchContacts = async () => {
    setIsFetching(true);
    try {
      let data: ContactResponse[];
      if (filterMode === "unread") {
        data = await contactService.getUnreadContacts();
      } else {
        data = await contactService.getAllContacts();
      }
      // sort by createdAt (latest first)
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setContacts(data);
      setError(null);
      hasFetched.current = true;
    } catch (err) {
      setError("Failed to fetch contacts. Please try again.");
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filterMode]);

  const handleDeleteContact = (contactId: number) => {
    setContactToDelete(contactId);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (contactToDelete === null) return;
    setIsDeleting(contactToDelete);
    try {
      await contactService.deleteContact(contactToDelete);
      setContacts((prev) => prev.filter((c) => c.id !== contactToDelete));
      setError(null);
    } catch (err) {
      setError("Failed to delete contact. Please try again.");
      console.error(err);
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false);
      setContactToDelete(null);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    setIsMarking(id);
    try {
       await contactService.markAsRead(id);
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: true } : c))
      );
    } catch (err) {
      setError("Failed to mark contact as read.");
      console.error(err);
    } finally {
      setIsMarking(null);
    }
  };

  const handleMarkAllAsRead = async () => {
      setIsMarkingAll(true);
      try {
        await contactService.markAllAsRead();
        setContacts((prev) => prev.map((c) => ({ ...c, read: true })));
      } catch (err) {
        setError("Failed to mark all as read.");
        console.error(err);
      }finally {
      setIsMarkingAll(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 ">
      <ContactList
        contacts={contacts}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isFetching={isFetching}
        error={error}
        isDeleting={isDeleting}
        isMarking={isMarking}
        onDelete={handleDeleteContact}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onRefresh={fetchContacts}
        isMarkingAll={isMarkingAll} 
      />

      <ConfirmModal
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
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

export default ContactManagement;
