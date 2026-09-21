import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { getGalleryItems, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../services/galleryService';
import { GalleryItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { GalleryModal } from './GalleryModal';
import { useToast } from '../../context/ToastContext';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems(false);
      setItems(data);
    } catch (err) {
      toast.error('Failed to load gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const handleSave = async (data: Partial<GalleryItem>) => {
    try {
      if (editingItem) {
        await updateGalleryItem(editingItem.id, data);
        toast.success('Gallery item updated successfully.');
      } else {
        await createGalleryItem(data as any);
        toast.success('Gallery photo added successfully.');
      }
      await loadGallery();
    } catch (err: any) {
      toast.error(err.message || 'Save failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteGalleryItem(deleteId);
      toast.success('Photo removed from Gallery.');
      setDeleteId(null);
      await loadGallery();
    } catch (err: any) {
      toast.error('Failed to delete photo');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Visual Gallery Manager
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage high-resolution photography displayed in the public gallery.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4 text-wood-300" />}
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
        >
          Upload New Photo
        </Button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          Loading gallery items...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          No gallery images found. Click "Upload New Photo" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm flex flex-col justify-between group"
            >
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />

                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/80 text-stone-100 text-[10px] uppercase font-bold tracking-wider backdrop-blur-sm">
                  {item.category}
                </div>

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-stone-800 shadow transition"
                    title="Edit"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                  {item.title}
                </h4>
                {item.description && (
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                    {item.description}
                  </p>
                )}

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
                  <span
                    className={`font-semibold ${
                      item.isPublished ? 'text-emerald-700' : 'text-stone-400'
                    }`}
                  >
                    {item.isPublished ? '● Published' : '○ Draft'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        item={editingItem}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Photo"
        message="Are you sure you want to delete this photo from the gallery and Firebase Storage?"
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
