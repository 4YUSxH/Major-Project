import { useState, useEffect } from "react";
import { useAnnouncementStore } from "../store/announcementStore";
import { useAuthStore } from "../store/authStore";
import { Megaphone, Plus, Trash2, Image as ImageIcon } from "lucide-react";

export default function Announcements() {
  const { announcements, fetchAnnouncements, createAnnouncement, deleteAnnouncement, isLoading } = useAnnouncementStore();
  const { user } = useAuthStore();
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState(null);

  const BASE_URL = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '';

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // We must use FormData because we are sending a physical File via multipart/form-data
    const data = new FormData();
    data.append("title", formData.title);
    data.append("content", formData.content);
    if (imageFile) {
      data.append("image", imageFile);
    }

    const success = await createAnnouncement(data);
    if (success) {
      setShowModal(false);
      setFormData({ title: "", content: "" });
      setImageFile(null);
    }
  };

  const isStaff = user?.role === "staff" || user?.role === "admin";

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notice Board</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Stay updated with the latest campus updates</p>
        </div>
        {isStaff && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>Post Notice</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto">
        {isLoading ? (
          <p className="text-center col-span-2 text-gray-500 py-10">Loading notices...</p>
        ) : announcements.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-[#111111] p-10 rounded-2xl border border-gray-100 dark:border-neutral-800 text-center flex flex-col items-center justify-center">
            <Megaphone size={40} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No notices posted yet.</p>
          </div>
        ) : (
          announcements.map((post) => (
            <div key={post._id} className="bg-white dark:bg-[#111111] rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden flex flex-col group">
              {post.imageUrl && (
                <div className="w-full h-48 bg-gray-100 dark:bg-black overflow-hidden relative">
                  <img 
                    src={`${BASE_URL}${post.imageUrl}`} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{post.title}</h3>
                  {isStaff && post.author?._id === user?._id && (
                    <button 
                      onClick={() => deleteAnnouncement(post._id)}
                      className="text-red-400 hover:text-red-600 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap flex-1 mb-4">{post.content}</p>
                <div className="text-xs text-gray-400 dark:text-gray-500 pt-4 border-t border-gray-50 dark:border-neutral-800">
                  Posted by <span className="font-medium text-gray-600 dark:text-gray-400">{post.author?.name || 'Staff'}</span> • {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#0a0a0a]">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Notice</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
                <textarea
                  required rows="4"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-800 bg-white dark:bg-black text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Attach Image (Optional)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-gray-100 dark:bg-neutral-800 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors border border-gray-200 dark:border-neutral-700">
                    <ImageIcon size={18} />
                    <span className="text-sm font-medium">Choose File</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </label>
                  {imageFile && <span className="text-sm text-primary-600 dark:text-primary-400 truncate max-w-[200px]">{imageFile.name}</span>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium disabled:opacity-50">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
