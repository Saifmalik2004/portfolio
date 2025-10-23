import React from "react";
import { BlogResponse } from "../../../types/blog";
import BlogCard from "./BlogCard";
import { useNavigate } from "react-router-dom";

type BlogListProps = {
  blogs: BlogResponse[];
  searchTerm: string;
  filterCategory: string;
  isFetching: boolean;
  isSaving: boolean;
  isDeleting: number | null;
  onDelete: (id: number) => void;
};

const SkeletonBlogCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="w-full h-48 bg-gray-200" />
    <div className="p-6 space-y-3">
      <div className="h-6 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-full" />
      <div className="h-4 bg-gray-300 rounded w-5/6" />
    </div>
  </div>
);

const BlogList: React.FC<BlogListProps> = ({
  blogs,
  searchTerm,
  filterCategory,
  isFetching,
  isSaving,
  isDeleting,
  onDelete,
}) => {
   const navigate = useNavigate();
  const filtered = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || blog.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  if (isFetching)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonBlogCard key={i} />
        ))}
      </div>
    );

  if (filtered.length === 0)
    return <div className="text-center py-12 text-gray-500">No blogs found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((blog) => (
        <BlogCard
          key={blog.id}
          blog={blog}
          onEdit={() => navigate(`/admin/blogs/${blog.id}/edit`)}
          onDelete={() => onDelete(blog.id)}
          isSaving={isSaving}
          isDeleting={isDeleting === blog.id}
        />
      ))}
    </div>
  );
};

export default BlogList;
