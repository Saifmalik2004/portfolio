import React, { useState } from "react";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { BlogRequest, BlogResponse } from "../../../types/blog";
import RichTextEditor from "./RIchTextEditor";
import { useLocation } from "react-router-dom";
import imageService from "@/services/imageUplaodService";

// 🧩 Reusable Section wrapper
const SectionCard: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = "" }) => (
  <div
    className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
  >
    {title && (
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
    )}
    {children}
  </div>
);

interface BlogEditorProps {
  blog?: BlogRequest | null;
  onSave: (data: BlogRequest) => void;
  onCancel: () => void;
  onPreview: (blog: BlogRequest) => void;
  isSaving: boolean;
}

const BlogEditor: React.FC<BlogEditorProps> = ({
  blog,
  onSave,
  onCancel,
  onPreview,
  isSaving,
}) => {
  // non-image fields
  const [formData, setFormData] = useState<Omit<BlogRequest, "image">>({
    title: (blog as BlogResponse | undefined)?.title || (blog as BlogRequest | undefined)?.title || "",
    slug: (blog as BlogResponse | undefined)?.slug || (blog as BlogRequest | undefined)?.slug || "",
    summary: (blog as BlogResponse | undefined)?.summary || (blog as BlogRequest | undefined)?.summary || "",
    content: (blog as BlogResponse | undefined)?.content || (blog as BlogRequest | undefined)?.content || "",
    category: (blog as BlogResponse | undefined)?.category || (blog as BlogRequest | undefined)?.category || "Development",
    readTime: (blog as BlogResponse | undefined)?.readTime || (blog as BlogRequest | undefined)?.readTime || "5 min read",
    author: (blog as BlogResponse | undefined)?.author || (blog as BlogRequest | undefined)?.author || "Your Name",
  });

  // existing image object from backend if editing
  const [imageObj, setImageObj] = useState<import("../../../types/project").ImageUploadResponse | null>(
    (blog as BlogResponse | undefined)?.image || (blog as BlogRequest | undefined)?.image || null
  );

  // client-side pending image (selected but not uploaded yet)
  const [pendingImage, setPendingImage] = useState<{ file: File; preview: string } | null>(null);
  // publicId of image to delete on save (if replaced)
  const [deletedPublicId, setDeletedPublicId] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    "Development",
    "Technology",
    "CSS",
    "JavaScript",
    "Backend",
    "Frontend",
    "Design",
    "Tutorial",
    "News",
    "Opinion",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!imageObj && !pendingImage) newErrors.image = "Featured image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePreview = () => {
    // build a BlogRequest-like object for preview (image may be pending)
    const img = pendingImage
      ? { publicId: "", url: pendingImage.preview }
      : imageObj;
    const previewPayload: BlogRequest = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      content: formData.content,
      category: formData.category,
      readTime: formData.readTime,
      author: formData.author,
      image: img as any,
    };
    onPreview(previewPayload);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const preview = URL.createObjectURL(file);
    // if we had an existing image, mark it for deletion when saving
    if (imageObj) setDeletedPublicId(imageObj.publicId);
    setImageObj(null);
    if (pendingImage) URL.revokeObjectURL(pendingImage.preview);
    setPendingImage({ file, preview });
    e.target.value = "";
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // delete old image if replaced or removed
      if (deletedPublicId) {
        await imageService.delete(deletedPublicId);
      }

      // upload pending image
      let finalImage = imageObj;
      if (pendingImage) {
        const resp = await imageService.uploadSingle("blogs", pendingImage.file);
        finalImage = resp;
      }

      const payload: BlogRequest = {
        title: formData.title,
        slug: formData.slug,
        summary: formData.summary,
        content: formData.content,
        category: formData.category,
        readTime: formData.readTime,
        author: formData.author,
        image: finalImage as any,
      };

      // call onSave and await if it returns a promise
      await Promise.resolve(onSave(payload));

      if (pendingImage) {
        URL.revokeObjectURL(pendingImage.preview);
        setPendingImage(null);
      }
      setDeletedPublicId(null);
    } catch (err) {
      console.error(err);
      alert("Image processing failed");
    } finally {
      setSubmitting(false);
    }
  };

  const location = useLocation();
  const isNew = location.pathname.includes("/new"); // 👈 agar route me '/new' hai
  const isEditing = !isNew;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSaving}
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Edit Blog Post" : "Create New Blog Post"}
              </h1>
              <p className="text-gray-600">
                {isEditing
                  ? "Update your existing blog post"
                  : "Write and publish a new blog post"}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handlePreview}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isSaving}
            >
              <Eye size={20} />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg relative"
              disabled={isSaving || submitting}
            >
              {isSaving || submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Save size={20} />
                  <span>{blog ? "Update" : "Save"} Blog</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto p-8 space-y-8">
        {/* 🔹 Title & Slug */}
        <SectionCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Blog Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className={`w-full px-4 py-3 text-lg border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your blog title..."
                disabled={isSaving || submitting}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-2">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                URL Slug *
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-2">/blogs/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => {
                    let slug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9\s-]/g, "")
                      .replace(/\s+/g, "-")
                      .replace(/-+/g, "-");
                    setFormData((prev) => ({ ...prev, slug }));
                  }}
                  className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.slug ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="blog-post-slug"
                  disabled={isSaving || submitting}
                />
              </div>
              {errors.slug && (
                <p className="text-red-500 text-sm mt-2">{errors.slug}</p>
              )}
            </div>
          </div>
        </SectionCard>

        {/* 🔹 Summary */}
        <SectionCard>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Summary *
          </label>
            <textarea
            value={formData.summary}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, summary: e.target.value }))
            }
            rows={3}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.summary ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Write a brief summary..."
            disabled={isSaving || submitting}
          />
          {errors.summary && (
            <p className="text-red-500 text-sm mt-2">{errors.summary}</p>
          )}
        </SectionCard>

        {/* 🔹 Author, ReadTime, Category */}
        <SectionCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, author: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your Name"
                disabled={isSaving || submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time
              </label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, readTime: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="5 min read"
                disabled={isSaving || submitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSaving || submitting}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </SectionCard>

        {/* 🔹 Featured Image */}
        <SectionCard title="Featured Image">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isSaving || submitting}
            />
            <button
              type="button"
              onClick={() => {
                // remove current selection
                if (pendingImage) {
                  URL.revokeObjectURL(pendingImage.preview);
                  setPendingImage(null);
                }
                if (imageObj) {
                  setDeletedPublicId(imageObj.publicId);
                  setImageObj(null);
                }
              }}
              className="text-red-600"
            >
              Remove
            </button>
          </div>

          {(pendingImage || imageObj) && (
            <div className="mt-4">
              <img
                src={pendingImage ? pendingImage.preview : imageObj?.url}
                alt="Featured"
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {errors.image && (
            <p className="text-red-500 text-sm mt-2">{errors.image}</p>
          )}
        </SectionCard>

        {/* 🔹 Full-width Editor */}
        <SectionCard title="Content *">
          <div className="min-h-[500px]">
            <RichTextEditor
              value={formData.content}
              onChange={(content) =>
                setFormData((prev) => ({ ...prev, content }))
              }
            />
          </div>
          {errors.content && (
            <p className="text-red-500 text-sm mt-2">{errors.content}</p>
          )}
        </SectionCard>
      </form>
    </div>
  );
};

export default BlogEditor;
