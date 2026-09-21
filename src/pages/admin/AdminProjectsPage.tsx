import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/projectsService';
import { Project, ProjectCategory } from '../../types';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { ProjectModal } from './ProjectModal';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';

export const AdminProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Modals state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Delete dialog state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const toast = useToast();

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects(false);
      setProjects(data);
    } catch (err) {
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateOrUpdate = async (projectData: Partial<Project>) => {
    try {
      if (editingProject) {
        await updateProject(editingProject.id, projectData);
        toast.success(`Project "${projectData.title}" updated successfully.`);
      } else {
        await createProject(projectData as any);
        toast.success(`Project "${projectData.title}" created successfully.`);
      }
      await loadProjects();
    } catch (err: any) {
      toast.error(err.message || 'Operation failed');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteProject(deleteId);
      toast.success('Project deleted from Firestore and Storage.');
      setDeleteId(null);
      await loadProjects();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete project');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Projects Portfolio Manager
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Create, update, and publish showcase woodwork and interior architecture projects.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4 text-wood-300" />}
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
        >
          Add New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-stone-900 text-xs sm:text-sm focus:border-wood-600 focus:ring-1 focus:ring-wood-600 outline-none transition"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-semibold uppercase">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-stone-800 text-xs font-medium outline-none bg-white"
          >
            <option value="All">All Categories</option>
            <option value="Interior Design">Interior Design</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Living Hall">Living Hall</option>
            <option value="Bedroom">Bedroom</option>
            <option value="Office">Office</option>
            <option value="Others">Others</option>
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">
            Loading projects from Cloud Firestore...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">
            No projects found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Visibility</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((proj) => (
                  <tr key={proj.id} className="hover:bg-stone-50/60 transition">
                    {/* Thumbnail & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-11 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                          <img
                            src={proj.coverImage}
                            alt={proj.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-serif font-bold text-stone-900 truncate max-w-xs">
                            {proj.title}
                          </div>
                          <div className="text-[11px] text-stone-400 font-mono truncate">
                            /{proj.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-6 text-stone-700 font-medium">
                      {proj.category}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {proj.status || 'Completed'}
                      </span>
                    </td>

                    {/* Visibility */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            proj.isPublished
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-stone-100 text-stone-500'
                          }`}
                        >
                          {proj.isPublished ? 'Published' : 'Draft'}
                        </span>

                        {proj.isFeatured && (
                          <span className="p-1 rounded-md bg-amber-100 text-amber-700" title="Featured on Homepage">
                            <Star className="w-3 h-3 fill-current" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/projects/${proj.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
                          title="View on site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-wood-700 hover:text-wood-900 hover:bg-wood-50 transition"
                          title="Edit project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(proj.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition"
                          title="Delete project"
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

      {/* Project Editor Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleCreateOrUpdate}
        project={editingProject}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will remove the Firestore document and associated photos from Firebase Storage."
        confirmText="Yes, Delete Project"
        loading={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
