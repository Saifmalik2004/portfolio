import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ContactSkeletonRow: React.FC = () => {
  return (
    <tr className="border-b">
      <td className="p-3">
        <Skeleton className="h-4 w-28 rounded" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-40 rounded" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-64 rounded" />
      </td>
      <td className="p-3">
        <Skeleton className="h-4 w-32 rounded" />
      </td>
      <td className="p-3 text-right">
        <div className="flex justify-end space-x-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </td>
    </tr>
  );
};

export default ContactSkeletonRow;
