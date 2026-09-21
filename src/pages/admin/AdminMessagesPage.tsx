import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, Trash2, CheckCircle2, MessageCircle } from 'lucide-react';
import { getMessages, updateMessageStatus, deleteMessage } from '../../services/messagesService';
import { ContactMessage } from '../../types';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

export const AdminMessagesPage: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id: string, newStatus: ContactMessage['status']) => {
    try {
      await updateMessageStatus(id, newStatus);
      toast.success(`Message marked as ${newStatus}.`);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      toast.error('Failed to update message status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteMessage(deleteId);
      toast.success('Message deleted.');
      setDeleteId(null);
      await loadMessages();
    } catch (err) {
      toast.error('Failed to delete message.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
          Client Messages & Inquiries
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Review inquiries submitted through the public contact page.
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          Loading inquiries...
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-3xl border border-stone-200">
          No messages received yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-white rounded-3xl p-6 border shadow-sm flex flex-col justify-between space-y-5 transition ${
                msg.status === 'unread'
                  ? 'border-emerald-300 ring-1 ring-emerald-200'
                  : 'border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-stone-900">
                      {msg.name}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <select
                    value={msg.status}
                    onChange={(e) => handleStatusChange(msg.id, e.target.value as ContactMessage['status'])}
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider outline-none border transition ${
                      msg.status === 'unread'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : msg.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-stone-100 text-stone-700 border-stone-200'
                    }`}
                  >
                    <option value="unread">Unread</option>
                    <option value="read">Read</option>
                    <option value="contacted">Contacted</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line">
                  "{msg.message}"
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <a href={`tel:${msg.phone}`} className="text-wood-800 font-semibold hover:underline">
                      {msg.phone}
                    </a>
                  </div>
                  {msg.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <a href={`mailto:${msg.email}`} className="hover:underline">
                        {msg.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <a
                  href={`https://wa.me/${msg.phone.replace(/[^\d]/g, '')}?text=Hi%20${encodeURIComponent(msg.name)},%20this%20is%20K.%20Selvam%20from%20JM%20INTERIOR.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reply on WhatsApp</span>
                </a>

                <button
                  onClick={() => setDeleteId(msg.id)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-red-700 hover:bg-red-50 transition"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Message"
        message="Are you sure you want to delete this client message?"
        confirmText="Yes, Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
