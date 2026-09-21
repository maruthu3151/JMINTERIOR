import React, { useState, useEffect } from 'react';
import { Calendar, Phone, Mail, Clock, Trash2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getAppointments, updateAppointmentStatus, deleteAppointment } from '../../services/appointmentsService';
import { Appointment } from '../../types';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Appointment['status']) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      toast.success(`Appointment marked as ${newStatus}.`);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      toast.error('Failed to update appointment status.');
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    try {
      await updateAppointmentStatus(id, appointments.find((a) => a.id === id)?.status || 'pending', notes);
      toast.success('Admin notes saved.');
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, adminNotes: notes } : a))
      );
    } catch (err) {
      toast.error('Failed to save notes.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteAppointment(deleteId);
      toast.success('Appointment deleted.');
      setDeleteId(null);
      await loadAppointments();
    } catch (err) {
      toast.error('Failed to delete appointment');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = statusFilter === 'all'
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Consultation Bookings
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review site visit and studio consultation requests submitted by clients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-500 uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 text-xs font-medium outline-none bg-white"
          >
            <option value="all">All ({appointments.length})</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          Loading appointments from Firestore...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          No appointments found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {apt.name}
                    </h3>
                    <p className="text-xs text-wood-700 font-semibold mt-0.5">
                      {apt.projectType}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={apt.status}
                    onChange={(e) => handleStatusChange(apt.id, e.target.value as Appointment['status'])}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider outline-none border transition ${
                      apt.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : apt.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : apt.status === 'completed'
                        ? 'bg-stone-200 text-stone-800 border-stone-300'
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {/* Preferred Date & Time */}
                <div className="mt-4 p-3.5 rounded-xl bg-stone-50 border border-stone-100 flex flex-wrap items-center gap-4 text-xs text-stone-700">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-wood-700" />
                    <span>{apt.preferredDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-wood-700" />
                    <span>{apt.preferredTime}</span>
                  </div>
                </div>

                {/* Client Contact Details */}
                <div className="mt-4 space-y-1.5 text-xs text-stone-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <a href={`tel:${apt.phone}`} className="text-wood-800 font-semibold hover:underline">
                      {apt.phone}
                    </a>
                  </div>
                  {apt.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{apt.email}</span>
                    </div>
                  )}
                </div>

                {apt.message && (
                  <div className="mt-4 text-xs text-stone-700 bg-wood-50/50 p-3 rounded-xl border border-wood-100">
                    <span className="font-semibold text-stone-900 block mb-0.5">Notes from client:</span>
                    "{apt.message}"
                  </div>
                )}
              </div>

              {/* Admin Internal Notes Input */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  Studio Staff Notes (Private)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={apt.adminNotes || ''}
                    onBlur={(e) => handleNotesChange(apt.id, e.target.value)}
                    placeholder="e.g. Called client; visiting site on Saturday 11am..."
                    className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs text-stone-800 outline-none focus:border-wood-600"
                  />
                  <button
                    onClick={() => setDeleteId(apt.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition shrink-0"
                    title="Delete appointment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment record?"
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
