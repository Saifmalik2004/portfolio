import { NodeViewWrapper } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState } from "react";

export const ResizableImageNode = ({ node, updateAttributes }: any) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const startSize = useRef({ width: 0, height: 0, mouseX: 0, mouseY: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent, corner: string) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      const img = imageRef.current;
      if (!img) return;

      const rect = img.getBoundingClientRect();
      startSize.current = {
        width: rect.width,
        height: rect.height,
        mouseX: e.clientX,
        mouseY: e.clientY,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!img) return;

        const deltaX = moveEvent.clientX - startSize.current.mouseX;
        const deltaY = moveEvent.clientY - startSize.current.mouseY;

        let newWidth = startSize.current.width;
        let newHeight = startSize.current.height;

        // Calculate new dimensions based on corner
        if (corner.includes("right")) {
          newWidth = startSize.current.width + deltaX;
        } else if (corner.includes("left")) {
          newWidth = startSize.current.width - deltaX;
        }

        if (corner.includes("bottom")) {
          newHeight = startSize.current.height + deltaY;
        } else if (corner.includes("top")) {
          newHeight = startSize.current.height - deltaY;
        }

        // Maintain aspect ratio
        const aspectRatio = startSize.current.width / startSize.current.height;
        newHeight = newWidth / aspectRatio;

        // Set minimum size
        if (newWidth < 100) newWidth = 100;
        if (newHeight < 100) newHeight = 100;

        // Set maximum size
        if (newWidth > 800) newWidth = 800;
        newHeight = newWidth / aspectRatio;

        updateAttributes({
          width: Math.round(newWidth),
          height: Math.round(newHeight),
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [updateAttributes]
  );

  useEffect(() => {
    const img = imageRef.current;
    if (!img) return;

    const handleClick = () => setIsSelected(true);
    const handleClickOutside = (e: MouseEvent) => {
      if (!img.contains(e.target as Node)) {
        setIsSelected(false);
      }
    };

    img.addEventListener("click", handleClick);
    document.addEventListener("click", handleClickOutside);

    return () => {
      img.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const width = node.attrs.width || "auto";
  const height = node.attrs.height || "auto";

  return (
    <NodeViewWrapper className="relative inline-block my-4 mx-auto max-w-full">
      <div
        className={`relative inline-block ${isSelected ? "ring-2 ring-primary ring-offset-2" : ""}`}
        style={{ maxWidth: "100%" }}
      >
        <img
          ref={imageRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ""}
          className="rounded-lg cursor-pointer select-none"
          style={{
            width: width === "auto" ? "auto" : `${width}px`,
            height: height === "auto" ? "auto" : `${height}px`,
            maxWidth: "100%",
          }}
          draggable={false}
        />

        {isSelected && !isResizing && (
          <>
            {/* Corner resize handles */}
            <div
              className="absolute -top-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-nw-resize border-2 border-white shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, "top-left")}
            />
            <div
              className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-ne-resize border-2 border-white shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, "top-right")}
            />
            <div
              className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full cursor-sw-resize border-2 border-white shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, "bottom-left")}
            />
            <div
              className="absolute -bottom-2 -right-2 w-4 h-4 bg-primary rounded-full cursor-se-resize border-2 border-white shadow-lg"
              onMouseDown={(e) => handleMouseDown(e, "bottom-right")}
            />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};
