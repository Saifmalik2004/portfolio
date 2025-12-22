import BlogControls from "@/components/admin/blog/BLogControls";
import BlogList from "@/components/admin/blog/BlogList";
import DeleteConfirmModal from "@/components/admin/project/DeleteConfirmModal";
import blogService from "@/services/blogService";
import {  PaginatedBlogResponse } from "@/types/blog";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";



const BlogManagement = () => {
  const navigate = useNavigate();

  const [blogs, setBlogs] = useState<PaginatedBlogResponse>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 6,
    page: 0,
    last:true
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

  const categories = ["all", ...new Set(blogs.content.map((b) => b.category))];

  const fetchBlogs = async (page = 0, size = 6) => {
    setIsFetching(true);
    try {
      const data = await blogService.getAllBlogs(page, size);
      setBlogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBlogs(0, blogsPerPage);
  }, []);

  const handleAddBlog = () => navigate("/admin/blogs/new");

  const handleRefresh = async () => {
    await fetchBlogs(currentPage - 1, blogsPerPage);
  };

  const confirmDelete = async () => {
    if (blogToDelete === null) return;
    setIsDeleting(blogToDelete);
    try {
      await blogService.deleteBlog(blogToDelete);
      setBlogs((prev) => ({
        ...prev,
        content: prev.content.filter((b) => b.id !== blogToDelete),
        totalElements: prev.totalElements - 1,
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
      setShowConfirmModal(false);
      setBlogToDelete(null);
    }
  };

  const handleDeleteBlog = (blogId: number) => {
    setBlogToDelete(blogId);
    setShowConfirmModal(true);
  };

  const filteredBlogs = blogs.content.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = blogs.totalPages || 1;

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchBlogs(page - 1, blogsPerPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <BlogControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
        onAdd={handleAddBlog}
        onRefresh={handleRefresh}
        isSaving={isSaving}
        isFetching={isFetching}
      />

      <BlogList
        blogs={filteredBlogs}
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        isFetching={isFetching}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onDelete={handleDeleteBlog}
      />

      {!isFetching && totalPages > 1 && (
        <Pagination className="mt-8 text-black">
          <PaginationContent className="justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                aria-disabled={currentPage === 1}
                className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>

            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  onClick={() => handlePageChange(i + 1)}
                  isActive={currentPage === i + 1}
                  className={
                    currentPage === i + 1
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "hover:bg-gray-100"
                  }
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                aria-disabled={currentPage === totalPages}
                className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <DeleteConfirmModal
        open={showConfirmModal}
        onOpenChange={setShowConfirmModal}
        onConfirm={confirmDelete}
        title="Delete Blog"
        description="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default BlogManagement;
