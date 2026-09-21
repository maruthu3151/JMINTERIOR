import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../../services/servicesService';
import { ServiceItem } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ServiceModal } from './ServiceModal';
import { useToast } from '../../context/ToastContext';

export const AdminServicesPage: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices(false);
      setServices(data);
    } catch (err) {
      toast.error('Failed to load services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleSave = async (data: Partial<ServiceItem>) => {
    try {
      if (editingService) {
        await updateService(editingService.id, data);
        toast.success(`Service "${data.title}" updated.`);
      } else {
        await createService(data as any);
        toast.success(`Service "${data.title}" created.`);
      }
      await loadServices();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteService(deleteId);
      toast.success('Service deleted from Firestore.');
      setDeleteId(null);
      await loadServices();
    } catch (err: any) {
      toast.error('Failed to delete service.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Services Manager
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Configure woodworking and interior execution services shown on the public website.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4 text-wood-300" />}
          onClick={() => {
            setEditingService(null);
            setModalOpen(true);
          }}
        >
          Add New Service
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            Loading services...
          </div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No services configured yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-4 px-6">Order</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Starting Price</th>
                  <th className="py-4 px-6">Features</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {services.map((svc) => (
                  <tr key={svc.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 px-6 font-mono text-stone-500">
                      #{svc.order || 1}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {svc.imageUrl && (
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                            <img src={svc.imageUrl} alt={svc.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <div className="font-serif font-bold text-stone-900">
                            {svc.title}
                          </div>
                          <div className="text-xs text-stone-500 line-clamp-1 max-w-xs">
                            {svc.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-stone-800">
                      {svc.startingPrice || '—'}
                    </td>

                    <td className="py-4 px-6 text-stone-600">
                      {svc.features?.length || 0} features listed
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          svc.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {svc.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingService(svc);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-wood-700 hover:text-wood-900 hover:bg-wood-50 transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(svc.id)}
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

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        service={editingService}
      />

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Service"
        message="Are you sure you want to delete this service? It will no longer appear on the public website."
        confirmText="Yes, Delete Service"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
