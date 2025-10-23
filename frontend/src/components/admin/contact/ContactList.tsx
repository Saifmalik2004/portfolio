import React from "react";
import { Search, RefreshCw, MailCheck } from "lucide-react";
import { ContactResponse } from "../../../types/contact";
import ContactRow from "./ContactRow";
import ContactSkeletonRow from "./ContactSkeletonRow";

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contact Messages</h2>
        <div className="flex items-center space-x-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            disabled={isFetching}
          >
            <RefreshCw size={18} />
          </button>
          <button
  onClick={onMarkAllAsRead}
  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-70"
  disabled={isMarkingAll}
>
  {isMarkingAll ? (
    <span className="flex items-center">
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
      Marking...
    </span>
  ) : (
    <>
      <MailCheck size={18} className="inline mr-1" />
      Mark All Read
    </>
  )}
</button>

        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            filterMode === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilterMode("all")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            filterMode === "unread" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilterMode("unread")}
        >
          Unread
        </button>
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
