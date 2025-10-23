import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Edit2 } from 'lucide-react';
import { BlogResponse } from '../../../types/blog';

interface BlogPreviewProps {
  blog: BlogResponse;
  onEdit: () => void;
   onBack: () => void;
}

const BlogPreview: React.FC<BlogPreviewProps> = ({ blog, onEdit ,onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      
      {/* Header */}
      <div className="relative">
        <button
        onClick={onBack}
        className="absolute top-4 left-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center space-x-1"
      >
        <ArrowLeft size={16} />
        <span className="text-gray-700">Back</span>
      </button>
        {blog.image && (
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-48 object-cover"
          />
        )}
        <button
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:bg-orange-50 transition-colors"
        >
          <Edit2 size={16} className="text-orange-500" />
        </button>
      </div>

      <div className="p-6">
        {/* Meta information */}
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar size={14} />
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{blog.readTime}</span>
          </div>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
            {blog.category}
          </span>
        </div>

        {/* Title and Summary */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{blog.title}</h2>
        <p className="text-gray-600 mb-6">{blog.summary}</p>

        {/* Content Preview */}
        <div className="prose prose-orange max-w-none dark:prose-invert">
          <div
            dangerouslySetInnerHTML={{ __html: blog.content }}
            className="-img:rounded-xl"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default BlogPreview;
