import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/ui/ImageUploader';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<GalleryItem>) => Promise<void>;
  item?: GalleryItem | null;
}

const CATEGORIES: GalleryItem['category'][] = [
  'Kitchen',
  'Bedroom',
  'Living Hall',
  'Office',
  'Other',
];

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryItem['category']>('Living Hall');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setCategory(item.category || 'Living Hall');
      setImageUrl(item.imageUrl || '');
      setDescription(item.description || '');
      setIsPublished(item.isPublished ?? true);
    } else {
      setTitle('');
      setCategory('Living Hall');
      setImageUrl('');
      setDescription('');
      setIsPublished(true);
    }
  }, [item, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl) {
      alert('Please provide an image title and upload a photo.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        category,
        imageUrl,
        description: description.trim(),
        isPublished,
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
      title={item ? 'Edit Gallery Photo' : 'Upload Gallery Photo'}
      description="Uploads to Firebase Storage and records entry in Cloud Firestore."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
            Upload Image *
          </label>
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            storagePath="gallery"
            aspectRatio="video"
            helpText="High-resolution carpentry/interior photo (JPG, PNG, WebP)"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Photo Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Fluted Teakwood Partition Wall"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as GalleryItem['category'])}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Description (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Hand-finished with satin polyurethane seal"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 rounded text-wood-700 focus:ring-wood-600"
            />
            <span className="text-sm font-semibold text-stone-800">
              Publish photo in public gallery
            </span>
          </label>
        </div>

        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Photo
          </Button>
        </div>
      </form>
    </Modal>
  );
};
