import React from "react";
import BlogPreview from "./BlogPreview";
import { BlogResponse } from "../../../types/blog";

type Props = {
  blog: BlogResponse;
  onBack: () => void;
  onEdit: () => void;
};

const BlogPreviewWrapper: React.FC<Props> = ({ blog, onBack, onEdit }) => {
  return <BlogPreview blog={blog} onBack={onBack} onEdit={onEdit} />;
};

export default BlogPreviewWrapper;
