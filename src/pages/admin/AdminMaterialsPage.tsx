import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../../services/materialsService';
import { MaterialItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { MaterialModal } from './MaterialModal';
import { useToast } from '../../context/ToastContext';

export const AdminMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials(false);
      setMaterials(data);
    } catch (err) {
      toast.error('Failed to load materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleSave = async (data: Partial<MaterialItem>) => {
    try {
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, data);
        toast.success(`Material "${data.name}" updated.`);
      } else {
        await createMaterial(data as any);
        toast.success(`Material "${data.name}" added.`);
      }
      await loadMaterials();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteMaterial(deleteId);
      toast.success('Material removed from Firestore.');
      setDeleteId(null);
      await loadMaterials();
    } catch (err: any) {
      toast.error('Failed to delete material');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Materials & Woodwork Catalog
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Specify certified plywood grades, solid timber choices, and premium surface finishes.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4 text-wood-300" />}
          onClick={() => {
            setEditingMaterial(null);
            setModalOpen(true);
          }}
        >
          Add New Material
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            Loading materials catalog...
          </div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No materials listed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-4 px-6">Material</th>
                  <th className="py-4 px-6">Properties</th>
                  <th className="py-4 px-6">Durability</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {materials.map((mat) => (
                  <tr key={mat.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {mat.imageUrl && (
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <img src={mat.imageUrl} alt={mat.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-serif font-bold text-stone-900">
                            {mat.name}
                          </div>
                          <div className="text-xs text-stone-500 line-clamp-1 max-w-xs">
                            {mat.usage}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-stone-700 text-xs">
                      {mat.properties}
                    </td>

                    <td className="py-4 px-6 text-stone-800 font-medium">
                      {mat.durability}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          mat.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {mat.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingMaterial(mat);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-wood-700 hover:text-wood-900 hover:bg-wood-50 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(mat.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MaterialModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        material={editingMaterial}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Material"
        message="Are you sure you want to delete this material entry from Firestore?"
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
