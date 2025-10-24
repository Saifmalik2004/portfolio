import BlogControls from "@/components/admin/blog/BLogControls";
import BlogList from "@/components/admin/blog/BlogList";
import DeleteConfirmModal from "@/components/admin/project/DeleteConfirmModal";
import blogService from "@/services/blogService";
import { BlogResponse } from "@/types/blog";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";

const BlogManagement = () => {
  const navigate = useNavigate();
  const hasFetched = useRef(false);

  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<number | null>(null);

  const categories = ["all", ...new Set(blogs.map((blog) => blog.category))];

  const fetchBlogs = async () => {
    if (hasFetched.current) return;
    setIsFetching(true);
    try {
      const data = await blogService.getAllBlogs();
      setBlogs(data);
      hasFetched.current = true;
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleAddBlog = () => navigate("/admin/blogs/new");

  const handleRefresh = async () => {
    hasFetched.current = false;
    setBlogs([]);
    await fetchBlogs();
  };

  const confirmDelete = async () => {
    if (blogToDelete === null) return;
    setIsDeleting(blogToDelete);
    try {
      await blogService.deleteBlog(blogToDelete);
      setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete));
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

  return (
    <div className="min-h-screen bg-gray-50 ">
      <BlogControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
        onAdd={handleAddBlog}
        onRefresh={handleRefresh}  // ✅ Add refresh prop
        isSaving={isSaving}
        isFetching={isFetching}    // Optional: disable controls while fetching
      />

      <BlogList
        blogs={blogs}
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        isFetching={isFetching}
        isSaving={isSaving}
        isDeleting={isDeleting}
        onDelete={handleDeleteBlog}
      />

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
