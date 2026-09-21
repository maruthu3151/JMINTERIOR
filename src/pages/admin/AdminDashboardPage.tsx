import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderKanban,
  Image as ImageIcon,
  Wrench,
  Calendar,
  Mail,
  Star,
  Plus,
  ArrowUpRight,
  Clock,
  Layers,
} from 'lucide-react';
import { getProjects } from '../../services/projectsService';
import { getGalleryItems } from '../../services/galleryService';
import { getServices } from '../../services/servicesService';
import { getAppointments } from '../../services/appointmentsService';
import { getMessages } from '../../services/messagesService';
import { getReviews } from '../../services/reviewsService';
import { Appointment, ContactMessage } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    galleryItems: 0,
    servicesCount: 0,
    pendingAppointments: 0,
    unreadMessages: 0,
    reviewsCount: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState<Appointment[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [projects, gallery, services, appointments, messages, reviews] = await Promise.all([
          getProjects(false),
          getGalleryItems(false),
          getServices(false),
          getAppointments(),
          getMessages(),
          getReviews(false),
        ]);

        setStats({
          totalProjects: projects.length,
          publishedProjects: projects.filter((p) => p.isPublished).length,
          galleryItems: gallery.length,
          servicesCount: services.length,
          pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
          unreadMessages: messages.filter((m) => m.status === 'unread').length,
          reviewsCount: reviews.length,
        });

        setRecentAppointments(appointments.slice(0, 4));
        setRecentMessages(messages.slice(0, 4));
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Projects',
      value: stats.totalProjects,
      subtext: `${stats.publishedProjects} Published`,
      icon: FolderKanban,
      path: '/admin/projects',
      color: 'bg-wood-700 text-stone-100',
    },
    {
      title: 'Visual Gallery',
      value: stats.galleryItems,
      subtext: 'Photos in catalog',
      icon: ImageIcon,
      path: '/admin/gallery',
      color: 'bg-stone-800 text-stone-100',
    },
    {
      title: 'Services',
      value: stats.servicesCount,
      subtext: 'Active service offerings',
      icon: Wrench,
      path: '/admin/services',
      color: 'bg-stone-800 text-stone-100',
    },
    {
      title: 'Pending Bookings',
      value: stats.pendingAppointments,
      subtext: 'Awaiting confirmation',
      icon: Calendar,
      path: '/admin/appointments',
      color: stats.pendingAppointments > 0 ? 'bg-amber-600 text-white' : 'bg-stone-800 text-stone-100',
    },
    {
      title: 'Unread Inquiries',
      value: stats.unreadMessages,
      subtext: 'New contact messages',
      icon: Mail,
      path: '/admin/messages',
      color: stats.unreadMessages > 0 ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-100',
    },
    {
      title: 'Client Reviews',
      value: stats.reviewsCount,
      subtext: 'Ratings & testimonials',
      icon: Star,
      path: '/admin/reviews',
      color: 'bg-stone-800 text-stone-100',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Studio Overview
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Real-time synchronization with Firebase Cloud Firestore & Storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-wood-800 hover:bg-wood-900 text-stone-50 text-xs font-semibold uppercase tracking-wider shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-wood-300" />
            <span>New Project</span>
          </Link>
          <Link
            to="/admin/gallery"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-semibold uppercase tracking-wider shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-wood-700" />
            <span>Upload Photo</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.title}
              to={card.path}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <div>
                <div className="text-2xl font-serif font-bold text-stone-900">
                  {loading ? '–' : card.value}
                </div>
                <div className="text-xs font-semibold text-stone-700 mt-0.5">
                  {card.title}
                </div>
                <div className="text-[11px] text-stone-400 mt-1 truncate">
                  {card.subtext}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Appointments & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest Bookings */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-wood-700" />
              <span>Recent Consultations</span>
            </h3>
            <Link
              to="/admin/appointments"
              className="text-xs font-semibold text-wood-700 hover:text-wood-900"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-16 bg-stone-100 rounded-xl animate-pulse" />
              <div className="h-16 bg-stone-100 rounded-xl animate-pulse" />
            </div>
          ) : recentAppointments.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl">
              No appointments submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {apt.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {apt.projectType} • {apt.preferredDate}
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 ${
                      apt.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : apt.status === 'approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'completed'
                        ? 'bg-stone-200 text-stone-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Contact Inquiries */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-wood-700" />
              <span>Recent Client Messages</span>
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs font-semibold text-wood-700 hover:text-wood-900"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-16 bg-stone-100 rounded-xl animate-pulse" />
              <div className="h-16 bg-stone-100 rounded-xl animate-pulse" />
            </div>
          ) : recentMessages.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-stone-50 rounded-2xl">
              No messages received yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-xl border border-stone-100 bg-stone-50/60 hover:bg-stone-50 transition flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-stone-900 truncate">
                      {msg.name}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5 line-clamp-1">
                      "{msg.message}"
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider shrink-0 ${
                      msg.status === 'unread'
                        ? 'bg-emerald-100 text-emerald-800'
                        : msg.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
