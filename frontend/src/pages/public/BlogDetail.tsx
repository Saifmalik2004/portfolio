import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import blogService from "../../services/blogService";
import { BlogResponse } from "../../types/blog";

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (slug) {
        try {
          const blogData = await blogService.getBlogBySlug(slug);
          setPost(blogData);
          setError(null);
        } catch (err) {
          setError("Failed to load blog post");
          console.error("Error fetching blog:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen flex justify-center items-center">
        <div className="animate-pulse w-full max-w-lg px-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-24 pb-20 bg-white min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            {error || "Blog Post Not Found"}
          </h1>
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            {error
              ? "An error occurred while loading the blog post."
              : "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center space-x-2 px-5 py-2 sm:px-6 sm:py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="mb-6 sm:mb-8"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center space-x-2 text-orange-500 hover:text-orange-600 text-sm sm:text-base transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Link>
        </motion.div>

        {/* Article Header */}
        <motion.header
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-10 sm:mb-12"
        >
          <div className="mb-4">
            <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-orange-100 text-orange-700 rounded-full border border-orange-200">
              {post.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 leading-snug break-words">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center text-gray-500 mb-6 sm:mb-8 text-sm sm:text-base gap-3">
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} />
              <span>{post.readTime}</span>
            </div>
          </div>

          {post.image && (
            <img
              src={post.image.url}
              alt={post.title}
              className="w-full h-56 sm:h-72 lg:h-96 object-cover rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg"
            />
          )}
        </motion.header>

        {/* Article Content */}
        <div className="prose prose-orange max-w-none text-black prose-sm sm:prose-base break-words">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;
