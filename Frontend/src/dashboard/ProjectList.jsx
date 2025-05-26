import { useState } from 'react';
import Card from '../ui/Card';
import Modal from '../ui/Modal';

// You can import your apiService if available, or just use the env var directly here:
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ProjectList({ projects, onProjectUpdated, onProjectDeleted }) {
  const [editingProject, setEditingProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      title: formData.get('title'),
      description: formData.get('description'),
      techStack: formData.get('techStack').split(',').filter(Boolean),
      category: formData.get('category'),
      liveUrl: formData.get('liveUrl'),
      githubUrl: formData.get('githubUrl'),
      featured: formData.get('featured') === 'on'
    };

    try {
      const res = await fetch(
        `${BACKEND_URL}/api/profiles/me/projects/${editingProject._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          body: JSON.stringify(updatedData),
          credentials: 'include'
        }
      );
      
      if (res.ok) {
        onProjectUpdated({ ...editingProject, ...updatedData });
        setEditingProject(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${BACKEND_URL}/api/profiles/me/projects/${deleteConfirm}`,
        {
          method: 'DELETE',
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          credentials: 'include'
        }
      );
      
      if (res.ok) {
        onProjectDeleted(deleteConfirm);
        setDeleteConfirm(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Your Projects ({projects.length})</h2>
      
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet. Add your first project!</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
         {projects.filter(Boolean).map(project => (

            <Card key={project._id} className="p-4">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{project.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.techStack.map(tech => (
                      <span key={tech} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProject(project)}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(project._id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)}>
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Edit Project</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingProject.title}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingProject.description}
                    className="w-full p-2 border rounded"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tech Stack (comma separated)</label>
                  <input
                    type="text"
                    name="techStack"
                    defaultValue={editingProject.techStack.join(',')}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingProject.category}
                    className="w-full p-2 border rounded"
                  >
            <option value="Full Stack">Full Stack Development</option>
            <option value="MERN STACK">MERN STACK</option>
             <option value="React App">React </option>
            <option value="Frontend">Frontend Development</option>
            <option value="Backend">Backend Development</option>
            <option value="Andriod App">Andriod Mobile App</option>
             <option value="IOS App">IOS Mobile App</option>
             <option value="ReactNative/Flutter">ReactNative/Flutter</option>
            <option value="UI/UX Design">UI/UX Design</option>
            <option value="Programming">Programming</option>
            <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Live URL</label>
                  <input
                    type="url"
                    name="liveUrl"
                    defaultValue={editingProject.liveUrl}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="githubUrl"
                    defaultValue={editingProject.githubUrl}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    id="edit-featured"
                    defaultChecked={editingProject.featured}
                    className="mr-2"
                  />
                  <label htmlFor="edit-featured" className="text-sm">Featured Project</label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="p-4">
          <h3 className="text-lg font-medium mb-4">Delete Project</h3>
          <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 border rounded"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}