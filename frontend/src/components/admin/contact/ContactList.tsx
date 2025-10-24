import React from "react";
import { Search, RefreshCw, MailCheck } from "lucide-react";
import { ContactResponse } from "../../../types/contact";
import ContactRow from "./ContactRow";
import ContactSkeletonRow from "./ContactSkeletonRow";
import { Button } from "@/components/ui/button";

interface ContactListProps {
  contacts: ContactResponse[];
  filterMode: "all" | "unread";
  setFilterMode: (value: "all" | "unread") => void;
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isFetching: boolean;
  error: string | null;
  isDeleting: number | null;
  isMarking: number | null;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
  isMarkingAll:boolean;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  filterMode,
  setFilterMode,
  searchTerm,
  setSearchTerm,
  isFetching,
  error,
  isDeleting,
  isMarking,
  onDelete,
  onMarkAsRead,
  onMarkAllAsRead,
  onRefresh,
  isMarkingAll,
}) => {
  const filteredContacts = contacts.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
     {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div>
    <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
      Contact Messages
    </h2>
    <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
      Manage and respond to your contact messages efficiently
    </p>
  </div>

  <div className="flex flex-wrap items-center gap-3">
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
      variant="default"
      onClick={onMarkAllAsRead}
      disabled={isMarkingAll}
      className="flex items-center gap-2"
    >
      <MailCheck className="h-4 w-4" />
      {isMarkingAll ? "Marking..." : "Mark All Read"}
    </Button>
  </div>
</div>


     {/* Filters */}
<div className="flex space-x-4">
  <Button
    variant={filterMode === "all" ? "default" : "outline"}
    onClick={() => setFilterMode("all")}
    size="sm"
  >
    All
  </Button>

  <Button
    variant={filterMode === "unread" ? "default" : "outline"}
    onClick={() => setFilterMode("unread")}
    size="sm"
  >
    Unread
  </Button>
</div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            disabled={isFetching}
          />
        </div>
      </div>

      {/* Error */}
      {error && <div className="bg-red-100 p-4 rounded-lg text-red-600">{error}</div>}

      {/* Contact List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Message</th>
              <th className="p-3">Created At</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <>
      {Array.from({ length: 5 }).map((_, i) => (
        <ContactSkeletonRow key={i} />
      ))}
    </>
            ) : filteredContacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No contacts found
                </td>
              </tr>
            ) : (
              filteredContacts.map((c) => (
                <ContactRow
                  key={c.id}
                  contact={c}
                  isDeleting={isDeleting}
                  isMarking={isMarking}
                  onDelete={onDelete}
                  onMarkAsRead={onMarkAsRead}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContactList;
