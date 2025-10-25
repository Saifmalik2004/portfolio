import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Toggle } from "@/components/ui/toggle";
import imageService from "@/services/imageUplaodService";
import {
  ProjectRequest,
  ProjectResponse,
  ProjectType,
} from "../../../types/project";
import { Skill } from "@/types/skill";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

// iOS / glass style Project Editor (shadcn + Tailwind)
// Place this file in your components folder and import where needed.

type Props = {
  project: ProjectResponse | null;
  onSave: (data: ProjectRequest) => void;
  onCancel: () => void;
  onPreview: (project: ProjectResponse) => void;
  isSaving: boolean;
  availableTechnologies: Skill[];
};

const slugify = (s = "") =>
  s
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

export default function ProjectEditorWrapperIOS({
  project,
  onSave,
  onCancel,
  onPreview,
  isSaving,
  availableTechnologies,
}: Props) {
  const techNameToId = useMemo(
    () =>
      new Map(availableTechnologies.map((t) => [t.name.toLowerCase(), t.id])),
    [availableTechnologies]
  );

  const [formData, setFormData] = useState<ProjectRequest>({
    title: project?.title || "",
    slug: project?.slug || "",
    description: project?.description || "",
    githubUrl: project?.githubUrl || "",
    liveDemoUrl: project?.liveDemoUrl || "",
    live: project?.live || false,
    published: project?.published || false,
    featured: project?.featured || false,
    type: project?.type || ProjectType.Personal,
    keyFeatures: project?.keyFeatures || [],
    images: project?.images || [],
    technologies:
      project?.technologies
        .map((t) =>
          typeof t === "string" ? techNameToId.get(t.toLowerCase()) ?? -1 : t
        )
        .filter((id) => id !== -1) || [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [filterTech, setFilterTech] = useState("");
  const [autoSlug, setAutoSlug] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [pendingImages, setPendingImages] = useState<
    { file: File; preview: string }[]
  >([]);
  const [deletedPublicIds, setDeletedPublicIds] = useState<string[]>([]);

  const pendingImagesRef = useRef(pendingImages);
  useEffect(() => {
    pendingImagesRef.current = pendingImages;
  }, [pendingImages]);

  useEffect(() => {
    if (autoSlug) setFormData((p) => ({ ...p, slug: slugify(p.title) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.title, autoSlug]);

  useEffect(() => {
    return () => {
      pendingImagesRef.current.forEach(({ preview }) =>
        URL.revokeObjectURL(preview)
      );
    };
  }, []);

  // safe input handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    if (newFeature.trim() === "") return;
    setFormData((prev) => ({
      ...prev,
      keyFeatures: [...prev.keyFeatures, newFeature.trim()],
    }));
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter((_, i) => i !== index),
    }));
  };

  const toggleTechnology = (techId: number) => {
    setFormData((prev) => {
      const has = prev.technologies.includes(techId);
      return {
        ...prev,
        technologies: has
          ? prev.technologies.filter((x) => x !== techId)
          : [...prev.technologies, techId],
      };
    });
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPendings = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPendingImages((prev) => [...prev, ...newPendings]);
    e.target.value = "";
  };

  const handleRemoveImage = (
    image: { publicId: string; url: string } | { file: File; preview: string }
  ) => {
    if ("publicId" in image) {
      setDeletedPublicIds((prev) => [...prev, image.publicId]);
    } else {
      URL.revokeObjectURL(image.preview);
      setPendingImages((prev) =>
        prev.filter((p) => p.preview !== image.preview)
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      // First, delete removed images from Cloudinary
      if (deletedPublicIds.length > 0) {
        await Promise.all(
          deletedPublicIds.map((publicId) => imageService.delete(publicId))
        );
      }

      // Then, upload new pending images
      let newUploaded: { publicId: string; url: string }[] = [];
      if (pendingImages.length > 0) {
        const filesToUpload = pendingImages.map((p) => p.file);
        newUploaded = await imageService.uploadMultiple(
          "projects",
          filesToUpload
        );
      }

      const cleanedSlug = slugify(formData.slug);
      const updatedImages = formData.images
        .filter((img) => !deletedPublicIds.includes(img.publicId))
        .concat(newUploaded);
      onSave({ ...formData, slug: cleanedSlug, images: updatedImages });
      pendingImages.forEach(({ preview }) => URL.revokeObjectURL(preview));
      setDeletedPublicIds([]);
      setPendingImages([]);
    } catch (err) {
      console.error(err);
      alert("Image processing failed");
    } finally {
      setUploading(false);
    }
  };

  const filteredTech = availableTechnologies.filter((t) =>
    t.name.toLowerCase().includes(filterTech.toLowerCase())
  );

  const displayedImages = formData.images.filter(
    (img) => !deletedPublicIds.includes(img.publicId)
  );

  return (
    <form onSubmit={handleSubmit} className="sm:p-2 max-w-4xl mx-auto">
      <Card className="relative backdrop-blur-md bg-white/40 border border-white/20 shadow-lg rounded-2xl overflow-visible">
        <CardHeader className="px-6 pt-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">
                {project ? "Edit Project" : "Add Project"}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Create or update project — admin panel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => project && onPreview(project)}
              >
                <Eye className="w-4 h-4" /> Preview
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title + Slug */}
          <div className="col-span-1 md:col-span-2">
            <Label>Title</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="My awesome project"
              disabled={isSaving || uploading}
            />

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              <div className="md:col-span-2">
                <Label>Slug</Label>
                <Input
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="auto-generated from title"
                  disabled={isSaving || uploading}
                />
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Label className="whitespace-nowrap">Auto slug</Label>
                <Toggle onPressedChange={(v) => setAutoSlug(Boolean(v))} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={isSaving || uploading}
            />
          </div>

          {/* URLs */}
          <div>
            <Label>GitHub URL</Label>
            <Input
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              type="url"
              disabled={isSaving || uploading}
            />
          </div>
          <div>
            <Label>Live Demo URL</Label>
            <Input
              name="liveDemoUrl"
              value={formData.liveDemoUrl}
              onChange={handleChange}
              type="url"
              disabled={isSaving || uploading}
            />
          </div>

          {/* Type */}
          <div className="md:col-span-2">
            <Label>Type</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(Object.values(ProjectType) as ProjectType[]).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setFormData((p) => ({ ...p, type: t }))}
                  disabled={isSaving || uploading}
                  className={`px-3 py-1 rounded-full border transition text-sm ${
                    formData.type === t
                      ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow"
                      : "bg-white/60 text-gray-800 border-gray-200"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="md:col-span-2">
            <Label>Technologies</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                placeholder="Search tech..."
                value={filterTech}
                onChange={(e) => setFilterTech(e.target.value)}
                disabled={isSaving || uploading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterTech("")}
              >
                Clear
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 max-h-40 overflow-auto">
              {filteredTech.map((tech) => (
                <button
                  type="button"
                  key={tech.id}
                  onClick={() => toggleTechnology(tech.id)}
                  disabled={isSaving || uploading}
                  className={`px-3 py-1 rounded-full border text-sm transition flex items-center gap-2 select-none ${
                    formData.technologies.includes(tech.id)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white/60 text-gray-800 border-gray-200"
                  }`}
                >
                  {tech.name}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="md:col-span-2">
            <Label>Key Features</Label>
            <div className="mt-2 flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                disabled={isSaving || uploading}
              />
              <Button type="button" onClick={addFeature} disabled={isSaving || uploading}>
                Add
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {formData.keyFeatures.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-white/60 border rounded-full px-3 py-1"
                >
                  <span className="text-sm">{f}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-xs text-red-600"
                    disabled={isSaving || uploading}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Images Section */}
          <div className="md:col-span-2">
            <Label>Project Images</Label>
            <div className="mt-2 flex items-center gap-2">
              <input
                type="file"
                multiple
                onChange={handleFilesChange}
                disabled={uploading || isSaving}
              />
            </div>

            <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {displayedImages.map((img) => (
                <div
                  key={img.publicId}
                  className="relative rounded-lg overflow-hidden border bg-white/50"
                >
                  <img
                    src={img.url}
                    alt={`project-${img.publicId}`}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img)}
                      className="bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 transition"
                      disabled={isSaving || uploading}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))}
              {pendingImages.map((p, idx) => (
                <div
                  key={p.preview}
                  className="relative rounded-lg overflow-hidden border bg-white/50"
                >
                  <img
                    src={p.preview}
                    alt={`pending-${idx}`}
                    className="w-full h-28 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(p)}
                      className="bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-700 transition"
                      disabled={isSaving || uploading}
                    >
                      ✖
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* checkboxes */}
          <div className="md:col-span-2 flex flex-wrap gap-4 mt-2">
            {(["live", "published", "featured"] as const).map((k) => (
              <label key={k} className="inline-flex items-center gap-2">
                <Checkbox
                  name={k}
                  checked={(formData as any)[k]}
                  disabled={isSaving || uploading}
                  onCheckedChange={(v) =>
                    setFormData((p) => ({ ...p, [k]: Boolean(v) }))
                  }
                />
                <span className="capitalize">{k}</span>
              </label>
            ))}
          </div>
        </CardContent>

        {/* Blocking overlay when saving/uploading */}
        {(isSaving || uploading) && (
          <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-50 bg-white/60 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
              <div className="text-sm text-gray-700">Saving project...</div>
            </div>
          </div>
        )}

        <CardFooter className="px-6 py-4 flex justify-end gap-3">
          <Button
            variant="ghost"
            onClick={onCancel}
            disabled={isSaving || uploading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || uploading}>
            {isSaving || uploading ? "Saving..." : "Save Project"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
