import React, { useState, useEffect } from 'react';
import { Project, ProjectCategory } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/ui/ImageUploader';
import { Plus, Trash2, Layers } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: Partial<Project>) => Promise<void>;
  project?: Project | null;
}

const CATEGORIES: ProjectCategory[] = [
  'Interior Design',
  'Kitchen',
  'Living Hall',
  'Bedroom',
  'Office',
  'Others',
];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  project,
}) => {
  const isEditing = Boolean(project);
  const projectId = project?.id || `proj_${Date.now()}`;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Living Hall');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [beforeImage, setBeforeImage] = useState('');
  const [afterImage, setAfterImage] = useState('');
  const [materialsInput, setMaterialsInput] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<Project['status']>('Completed');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setSlug(project.slug || '');
      setCategory(project.category || 'Living Hall');
      setDescription(project.description || '');
      setCoverImage(project.coverImage || '');
      setGalleryImages(project.galleryImages || []);
      setBeforeImage(project.beforeImage || '');
      setAfterImage(project.afterImage || '');
      setMaterialsInput((project.materials || []).join(', '));
      setBudget(project.budget || '');
      setStatus(project.status || 'Completed');
      setIsPublished(project.isPublished ?? true);
      setIsFeatured(project.isFeatured ?? false);
    } else {
      setTitle('');
      setSlug('');
      setCategory('Living Hall');
      setDescription('');
      setCoverImage('');
      setGalleryImages([]);
      setBeforeImage('');
      setAfterImage('');
      setMaterialsInput('Boiling Water Proof Marine Ply, Natural Teak Veneer');
      setBudget('');
      setStatus('Completed');
      setIsPublished(true);
      setIsFeatured(false);
    }
  }, [project, isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing || !slug) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generated);
    }
  };

  const handleAddGalleryImage = (url: string) => {
    if (url) {
      setGalleryImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !coverImage) {
      alert('Please enter a project title and upload a cover image.');
      return;
    }

    const materials = materialsInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        category,
        description: description.trim(),
        coverImage,
        galleryImages,
        beforeImage: beforeImage || undefined,
        afterImage: afterImage || undefined,
        materials,
        budget: budget.trim() || undefined,
        status,
        isPublished,
        isFeatured,
      });
      onClose();
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Project' : 'Create New Project'}
      description="All images are uploaded directly to Firebase Storage and recorded in Firestore."
      maxWidth="4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase tracking-widest font-bold text-stone-500">
            1. Basic Information
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Modern Minimalist Modular Kitchen"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-slug"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Project Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Project['status'])}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition bg-white"
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Project Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the architectural concept, carpentry challenges, joinery details, and spatial layout..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition resize-y"
            />
          </div>
        </div>

        {/* Section 2: Cover & Gallery Images */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h4 className="text-xs uppercase tracking-widest font-bold text-stone-500">
            2. Photography & Media (Firebase Storage)
          </h4>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Primary Cover Photo *
            </label>
            <ImageUploader
              value={coverImage}
              onChange={setCoverImage}
              storagePath={`projects/${projectId}/cover`}
              aspectRatio="video"
              helpText="Primary hero image for this project (JPG, PNG, WebP)"
            />
          </div>

          {/* Gallery Images List */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Additional Project Gallery Photos ({galleryImages.length})
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {galleryImages.map((imgUrl, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-stone-200 group bg-stone-100">
                  <img src={imgUrl} alt={`Gallery item ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(i)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              <div className="aspect-square">
                <ImageUploader
                  value=""
                  onChange={handleAddGalleryImage}
                  storagePath={`projects/${projectId}/gallery`}
                  aspectRatio="square"
                  helpText="Add photo"
                  className="h-full"
                />
              </div>
            </div>
          </div>

          {/* Before & After Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Before Renovation Photo (Optional)
              </label>
              <ImageUploader
                value={beforeImage}
                onChange={setBeforeImage}
                storagePath={`projects/${projectId}/before-after`}
                aspectRatio="video"
                helpText="Original site photo before interior woodwork"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                After Transformation Photo (Optional)
              </label>
              <ImageUploader
                value={afterImage}
                onChange={setAfterImage}
                storagePath={`projects/${projectId}/before-after`}
                aspectRatio="video"
                helpText="Final finished room from the same perspective"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Materials & Investment */}
        <div className="space-y-4 pt-4 border-t border-stone-200">
          <h4 className="text-xs uppercase tracking-widest font-bold text-stone-500">
            3. Specs & Investment
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Materials Used (Comma-separated)
              </label>
              <input
                type="text"
                value={materialsInput}
                onChange={(e) => setMaterialsInput(e.target.value)}
                placeholder="710 BWP Marine Ply, Teak Veneer, Blum Tandembox"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Budget / Estimated Cost
              </label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. ₹9.5 Lakhs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-wood-700 focus:ring-wood-600"
              />
              <span className="text-sm font-semibold text-stone-800">
                Publish this project publicly
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-wood-700 focus:ring-wood-600"
              />
              <span className="text-sm font-semibold text-stone-800">
                Feature on Homepage
              </span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            {isEditing ? 'Save Changes' : 'Publish Project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
