import React from "react";

const SkeletonCertificateCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCertificateCard;
