import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import blogService from '../../services/blogService';
import { BlogResponse } from '../../types/blog';

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
               transition-all duration-300"
  >
    {/* Image */}
    <div className="relative overflow-hidden">
      <img
        src={post.image.url || '/assets/images/blog-default.jpg'}
        alt={post.title}
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Category */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 text-xs font-medium 
                       bg-white/70 backdrop-blur-md text-gray-800 
                       border border-gray-200 rounded-full">
          {post.category}
        </span>
      </div>
    </div>

    {/* Content */}
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

      <p className="text-gray-700 text-sm mb-5 line-clamp-3 leading-relaxed">
        {post.summary}
      </p>

      <Link
        to={`/blogs/${post.slug}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
      >
        Read More
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition-transform"
        />
      </Link>
    </div>
  </motion.article>
);


const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 rounded-t-2xl" />
    <div className="p-6 border border-gray-100 rounded-b-2xl">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data);
        setError(null);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
         
         <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 text-center leading-relaxed">
  Thoughts, tutorials, and insights about web development, design, and technology.
  Sharing knowledge and experiences from my journey as a developer.
</p>

        </motion.div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <LoadingSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{error}</h2>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentBlogs.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-16"
          >
            <div className="flex space-x-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentPage === index + 1
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
