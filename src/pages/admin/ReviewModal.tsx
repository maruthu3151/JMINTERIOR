import React, { useState, useEffect } from 'react';
import { ReviewItem } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Star } from 'lucide-react';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (review: Partial<ReviewItem>) => Promise<void>;
  review?: ReviewItem | null;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSave,
  review,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [projectType, setProjectType] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (review) {
      setCustomerName(review.customerName || '');
      setRating(review.rating ?? 5);
      setReviewText(review.reviewText || '');
      setProjectType(review.projectType || '');
      setIsPublished(review.isPublished ?? true);
    } else {
      setCustomerName('');
      setRating(5);
      setReviewText('');
      setProjectType('Full Home Interior');
      setIsPublished(true);
    }
  }, [review, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !reviewText.trim()) {
      alert('Please provide the customer name and review text.');
      return;
    }

    try {
      setSaving(true);
      await onSave({
        customerName: customerName.trim(),
        rating,
        reviewText: reviewText.trim(),
        projectType: projectType.trim() || undefined,
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
      title={review ? 'Edit Review' : 'Add Client Review'}
      description="Manage verified customer ratings and feedback."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Client Name *
          </label>
          <input
            type="text"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Anand & Meenakshi"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Star Rating (1 to 5)
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 text-2xl transition ${
                  star <= rating ? 'text-amber-500' : 'text-stone-300'
                }`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Project Type / Location
          </label>
          <input
            type="text"
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            placeholder="e.g. Modular Kitchen & TV Unit, Velachery"
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Review Text *
          </label>
          <textarea
            required
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What the client said about K. Selvam's carpentry and project delivery..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-900 text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition resize-y"
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
              Publish on public testimonials section
            </span>
          </label>
        </div>

        <div className="pt-6 border-t border-stone-200 flex items-center justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={saving}>
            Save Review
          </Button>
        </div>
      </form>
    </Modal>
  );
};
