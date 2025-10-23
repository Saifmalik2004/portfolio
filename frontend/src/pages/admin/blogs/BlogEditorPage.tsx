import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogService from "@/services/blogService";
import BlogEditor from "@/components/admin/blog/BLogEditor";
import BlogPreview from "@/components/admin/blog/BlogPreview";
import { BlogRequest, BlogResponse } from "@/types/blog";

const mapResponseToRequest = (b: BlogResponse): BlogRequest => ({
  title: b.title,
  slug: b.slug,
  summary: b.summary,
  content: b.content,
  category: b.category,
  readTime: b.readTime,
  author: b.author,
  image: b.image,
});

const BlogEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState<BlogRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit"); // 🧩 toggle state

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      setIsLoading(true);
      try {
        const data = await blogService.getBlogById(Number(id));
        setBlog(mapResponseToRequest(data));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSave = async (data: BlogRequest) => {
    setIsSaving(true);
    try {
      if (id) {
        await blogService.updateBlog(Number(id), data);
      } else {
        await blogService.createBlog(data);
      }
      navigate("/admin/blogs");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => navigate("/admin/blogs");

  if (isLoading) return <div className="p-8">Loading blog...</div>;

  // 🧭 Switch between preview/edit
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {viewMode === "edit" ? (
        <BlogEditor
          blog={blog}
          onSave={handleSave}
          onCancel={handleCancel}
          onPreview={(updatedBlog) => {
            setBlog(updatedBlog);
            setViewMode("preview");
          }}
          isSaving={isSaving}
        />
      ) : (
        <BlogPreview
          blog={blog as any}
          onEdit={() => setViewMode("edit")}
          onBack={handleCancel}
        />
      )}
    </div>
  );
};

export default BlogEditorPage;
