import React from "react";
import { Edit, Trash2, User, Clock, Calendar } from "lucide-react";
import { BlogResponse } from "../../../types/blog";

type BlogCardProps = {
  blog: BlogResponse;
  onEdit: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
};

const BlogCard: React.FC<BlogCardProps> = ({
  blog,
  onEdit,
  onDelete,
  isSaving,
  isDeleting,
}) => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
    <div className="relative">
      <img
        src={blog.image.url}
        alt={blog.title}
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          {blog.category}
        </span>
      </div>
    </div>

    <div className="p-6">
      <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-lg">
        {blog.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{blog.summary}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar size={12} />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} />
            <span>{blog.readTime}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <User size={12} />
          <span>{blog.author}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit"
            disabled={isSaving || isDeleting}
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors relative"
            title="Delete"
            disabled={isSaving || isDeleting}
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default BlogCard;
