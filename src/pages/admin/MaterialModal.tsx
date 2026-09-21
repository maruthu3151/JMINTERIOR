import React, { useState, useEffect } from 'react';
import { MaterialItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/ui/ImageUploader';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (material: Partial<MaterialItem>) => Promise<void>;
  material?: MaterialItem | null;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  material,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [properties, setProperties] = useState('');
  const [durability, setDurability] = useState('');
  const [finish, setFinish] = useState('');
  const [usage, setUsage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (material) {
      setName(material.name || '');
      setDescription(material.description || '');
      setProperties(material.properties || '');
      setDurability(material.durability || '');
      setFinish(material.finish || '');
      setUsage(material.usage || '');
      setImageUrl(material.imageUrl || '');
      setIsPublished(material.isPublished ?? true);
    } else {
      setName('');
      setDescription('');
      setProperties('');
      setDurability('');
      setFinish('');
      setUsage('');
      setImageUrl('');
      setIsPublished(true);
    }
  }, [material, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a material name.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        name: name.trim(),
        description: description.trim(),
        properties: properties.trim(),
        durability: durability.trim(),
        finish: finish.trim(),
        usage: usage.trim(),
        imageUrl: imageUrl || undefined,
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
      title={material ? 'Edit Material' : 'Add New Material'}
      description="Define material properties, durability rating, finishes, and usage recommendations."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Material / Timber Name *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. 710 Boiling Water Proof (BWP) Marine Ply"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Material Sample Image
          </label>
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            storagePath="materials"
            aspectRatio="video"
            helpText="Photo of wood grain or surface texture"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Overview Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key technical explanation of this material..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Properties
            </label>
            <input
              type="text"
              value={properties}
              onChange={(e) => setProperties(e.target.value)}
              placeholder="e.g. Phenolic bonded, termite proof"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Durability & Life Expectancy
            </label>
            <input
              type="text"
              value={durability}
              onChange={(e) => setDurability(e.target.value)}
              placeholder="e.g. 25+ Years"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Available Finishes
            </label>
            <input
              type="text"
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              placeholder="e.g. Natural Matte, PU Satin, High Gloss"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Recommended Usage
            </label>
            <input
              type="text"
              value={usage}
              onChange={(e) => setUsage(e.target.value)}
              placeholder="e.g. Kitchen shutters, bathroom vanities"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
            />
          </div>
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
              Publish material in public catalog
            </span>
          </label>
        </div>

        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Material
          </Button>
        </div>
      </form>
    </Modal>
  );
};
