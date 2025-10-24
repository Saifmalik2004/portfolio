


import React, { useCallback } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Underline from "@tiptap/extension-underline";
import { common, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Minus,
} from "lucide-react";
import {CustomImage} from "./CustomImage";
import { toast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {

  
  const lowlight = createLowlight(common);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        codeBlock: false,
    
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write your story...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HorizontalRule,
      CustomImage.configure({
        inline: false,
        allowBase64: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "bg-muted rounded-lg p-4 font-mono text-sm overflow-x-auto",
        },
      }),
      
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4 text-gray-800 dark:text-gray-100",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
  const url = window.prompt("Enter image URL");
  if (url) {
    if (!url.startsWith("http")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL (must start with http or https).",
        variant: "destructive",
      });
      return;
    }

    editor?.chain().focus().setImage({ src: url }).run();
  }
}, [editor]);


  

  const addHorizontalLine = () => {
    editor?.chain().focus().setHorizontalRule().run();
  };

  if (!editor) return null;

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold"), title: "Bold" },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic"), title: "Italic" },
    { icon: UnderlineIcon, action: () => editor.chain().focus().toggleUnderline().run(), active: editor.isActive("underline"), title: "Underline" },
    { type: "divider" },
    { icon: Heading1, action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }), title: "H1" },
    { icon: Heading2, action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }), title: "H2" },
    { icon: Heading3, action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }), title: "H3" },
    { type: "divider" },
    { icon: List, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList"), title: "Bullet List" },
    { icon: ListOrdered, action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList"), title: "Numbered List" },
    { icon: Quote, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote"), title: "Quote" },
    { type: "divider" },
    { icon: Code, action: () => editor.chain().focus().toggleCodeBlock().run(), active: editor.isActive("codeBlock"), title: "Code Block" },
    {
      icon: LinkIcon,
      action: () => {
        const url = window.prompt("Enter link URL");
        if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
      },
      title: "Insert Link",
    },
    { icon: ImageIcon, action: addImage, title: "Insert Image" },
    { type: "divider" },
    { icon: AlignLeft, action: () => editor.chain().focus().setTextAlign("left").run(), active: editor.isActive({ textAlign: "left" }), title: "Align Left" },
    { icon: AlignCenter, action: () => editor.chain().focus().setTextAlign("center").run(), active: editor.isActive({ textAlign: "center" }), title: "Align Center" },
    { icon: AlignRight, action: () => editor.chain().focus().setTextAlign("right").run(), active: editor.isActive({ textAlign: "right" }), title: "Align Right" },
    { type: "divider" },
    { icon: Minus, action: addHorizontalLine, title: "Insert Horizontal Line" },
  ];

  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 p-2">
        {buttons.map((btn, idx) =>
          btn.type === "divider" ? (
            <div key={idx} className="w-px h-5 bg-gray-300 mx-1" />
          ) : (
            <button
              key={idx}
              onClick={btn.action}
              title={btn.title}
              className={`p-2 rounded-md hover:bg-gray-200 transition-colors ${
                btn.active ? "bg-gray-300" : ""
              }`}
              type="button"
            >
              {btn.icon ? React.createElement(btn.icon, { size: 16 }) : null}
            </button>
          )
        )}
      </div>

      {/* Editor Content */}
      <div className="min-h-[400px] bg-white dark:bg-neutral-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichTextEditor;
