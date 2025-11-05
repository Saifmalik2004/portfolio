import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { BlogResponse } from "../../types/blog";

interface BlogCardProps {
  post: BlogResponse;
  index: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, index }) => (
  <motion.article
    key={post.id}
    initial={{ y: 60, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.08, duration: 0.35 }}
    whileHover={{ y: -6, scale: 1.015 }}
    className="group bg-white/70 backdrop-blur-xl rounded-2xl overflow-hidden 
               border border-gray-200 shadow-[0_8px_28px_-6px_rgba(0,0,0,0.1)]
               hover:shadow-[0_10px_32px_-4px_rgba(0,0,0,0.12)]
               transition-all duration-300 relative"
  >
    {/* Full clickable area */}
    <Link
      to={`/blogs/${post.slug}`}
      className="absolute inset-0 z-10"
      aria-label={`Read blog: ${post.title}`}
    ></Link>

    {/* Image Section */}
    <div className="relative overflow-hidden">
      <img
        src={post.image.url || "/assets/images/blog-default.jpg"}
        alt={post.title}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        decoding="async"
      />

      {/* Category Tag */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-medium 
                       bg-white/70 backdrop-blur-md text-gray-800 
                       border border-gray-200 rounded-full">
          {post.category}
        </span>
      </div>
    </div>

    {/* Content Section */}
    <div className="p-6">
      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <Calendar size={14} />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Clock size={14} />
          <span>{post.readTime}</span>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors">
        {post.title}
      </h2>

      <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
        {post.summary}
      </p>
    </div>
  </motion.article>
);

export default BlogCard;
