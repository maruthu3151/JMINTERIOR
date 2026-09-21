import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { getReviews, createReview, updateReview, deleteReview } from '../../services/reviewsService';
import { ReviewItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ReviewModal } from './ReviewModal';
import { useToast } from '../../context/ToastContext';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(false);
      setReviews(data);
    } catch (err) {
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSave = async (data: Partial<ReviewItem>) => {
    try {
      if (editingReview) {
        await updateReview(editingReview.id, data);
        toast.success('Review updated.');
      } else {
        await createReview(data as any);
        toast.success('Review added.');
      }
      await loadReviews();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteReview(deleteId);
      toast.success('Review deleted.');
      setDeleteId(null);
      await loadReviews();
    } catch (err) {
      toast.error('Failed to delete review');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Reviews & Testimonials
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage customer feedback displayed across the website.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4 text-wood-300" />}
          onClick={() => {
            setEditingReview(null);
            setModalOpen(true);
          }}
        >
          Add New Review
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No reviews yet. Click "Add New Review" to create one.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50/60 transition"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-stone-900 text-base">
                      {rev.customerName}
                    </h4>
                    {rev.projectType && (
                      <span className="text-xs text-wood-700 font-medium">
                        • {rev.projectType}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 italic">
                    "{rev.reviewText}"
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rev.isPublished
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {rev.isPublished ? 'Published' : 'Hidden'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingReview(rev);
                        setModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-wood-700 hover:text-wood-900 hover:bg-wood-50 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(rev.id)}
                      className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        review={editingReview}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Review"
        message="Are you sure you want to delete this customer review from Firestore?"
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
