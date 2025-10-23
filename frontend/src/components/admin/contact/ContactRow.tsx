import React from "react";
import { Trash2, Check } from "lucide-react";
import { ContactResponse } from "../../../types/contact";

interface ContactRowProps {
  contact: ContactResponse;
  isDeleting: number | null;
  isMarking: number | null;
  onDelete: (id: number) => void;
  onMarkAsRead: (id: number) => void;
}

const ContactRow: React.FC<ContactRowProps> = ({
  contact,
  isDeleting,
  isMarking,
  onDelete,
  onMarkAsRead,
}) => {
  return (
    <tr className={contact.read ? "bg-white" : "bg-orange-50"}>
      <td className="p-3 font-medium">{contact.fullName}</td>
      <td className="p-3 text-sm text-gray-600">{contact.email}</td>
      <td className="p-3 text-sm">{contact.message}</td>
      <td className="p-3 text-sm text-gray-500">
        {new Date(contact.createdAt).toLocaleString()}
      </td>
      <td className="p-3 text-right space-x-2">
        {!contact.read && (
          <button
            onClick={() => onMarkAsRead(contact.id)}
            disabled={isMarking === contact.id}
            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {isMarking === contact.id ? "..." : <Check size={16} />}
          </button>
        )}
        <button
          onClick={() => onDelete(contact.id)}
          disabled={isDeleting === contact.id}
          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          {isDeleting === contact.id ? "..." : <Trash2 size={16} />}
        </button>
      </td>
    </tr>
  );
};

export default ContactRow;
