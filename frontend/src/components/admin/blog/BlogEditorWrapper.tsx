import React from "react";
import BlogEditor from "./BLogEditor";
import { BlogRequest } from "../../../types/blog";

type Props = {
  blog: BlogRequest | null;
  onSave: (data: BlogRequest) => void;
  onCancel: () => void;
  onPreview: (data: BlogRequest) => void;
  isSaving: boolean;
};

const BlogEditorWrapper: React.FC<Props> = ({ blog, onSave, onCancel, onPreview, isSaving }) => {
  return (
    <BlogEditor blog={blog} onSave={onSave} onCancel={onCancel} onPreview={onPreview} isSaving={isSaving} />
  );
};

export default BlogEditorWrapper;
