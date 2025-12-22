import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import blogService from "@/services/blogService";
import { BlogResponse ,PaginatedBlogResponse} from "@/types/blog";
import BlogCard from "@/components/blog/BlogCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";



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
  const [currentPage, setCurrentPage] = useState(0); // 0-based index
  const [totalPages, setTotalPages] = useState(0);
  const blogsPerPage = 6; // must match backend

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data: PaginatedBlogResponse = await blogService.getAllBlogs(currentPage, blogsPerPage);
        setBlogs(data.content);
        setTotalPages(data.totalPages);
        setError(null);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 bg-white min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0 leading-relaxed">
            Thoughts, tutorials, and insights about web development, design, and technology.
            Sharing knowledge and experiences from my journey as a developer.
          </p>
        </motion.div>

        {/* Blog Grid */}
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
            {blogs.map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </div>
        )}

        {/* ✅ Shadcn Pagination */}
        {!loading && !error && totalPages > 1 && (
          <Pagination className="mt-16 text-black">
            <PaginationContent className="justify-center">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                  aria-disabled={currentPage === 0}
                  className={currentPage === 0 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => setCurrentPage(index)}
                    isActive={currentPage === index}
                    className={
                      currentPage === index
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "hover:bg-gray-100"
                    }
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                  aria-disabled={currentPage === totalPages - 1}
                  className={currentPage === totalPages - 1 ? "opacity-50 pointer-events-none" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </motion.div>
  );
};

export default BlogPage;
