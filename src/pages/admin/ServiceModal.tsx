import React, { useState, useEffect } from 'react';
import { ServiceItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { ImageUploader } from '../../components/ui/ImageUploader';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<ServiceItem>) => Promise<void>;
  service?: ServiceItem | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  service,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [startingPrice, setStartingPrice] = useState('');
  const [order, setOrder] = useState(1);
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (service) {
      setTitle(service.title || '');
      setDescription(service.description || '');
      setImageUrl(service.imageUrl || '');
      setFeaturesInput((service.features || []).join('\n'));
      setStartingPrice(service.startingPrice || '');
      setOrder(service.order ?? 1);
      setIsPublished(service.isPublished ?? true);
    } else {
      setTitle('');
      setDescription('');
      setImageUrl('');
      setFeaturesInput('');
      setStartingPrice('');
      setOrder(1);
      setIsPublished(true);
    }
  }, [service, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a service title.');
      return;
    }

    const features = featuresInput
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      setSaving(true);
      await onSave({
        title: title.trim(),
        description: description.trim(),
        imageUrl: imageUrl || undefined,
        features,
        startingPrice: startingPrice.trim() || undefined,
        order: Number(order) || 1,
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
      title={service ? 'Edit Service' : 'Add New Service'}
      description="Update service deliverables, feature specifications, and pricing."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Service Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Modular Kitchens & Pantries"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Service Feature Photo
          </label>
          <ImageUploader
            value={imageUrl}
            onChange={setImageUrl}
            storagePath="services"
            aspectRatio="video"
            helpText="Representative photo of this service"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Detailed Description
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this service entails..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Key Features (One per line)
          </label>
          <textarea
            rows={3}
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder="BWP Marine Grade Plywood&#10;Soft-close Hydraulic Hinges&#10;Integrated Sensor Lighting"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition font-sans"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Starting Price / Estimate
            </label>
            <input
              type="text"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              placeholder="e.g. ₹1.8 Lakhs"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Display Order
            </label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
              min={1}
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
              Publish service on website
            </span>
          </label>
        </div>

        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Service
          </Button>
        </div>
      </form>
    </Modal>
  );
};
