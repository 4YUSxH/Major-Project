import { useState, useEffect } from "react";
import { useKbStore } from "../store/kbStore";
import { useAuthStore } from "../store/authStore";
import { Plus, BookOpen, Search, Trash2, Edit2 } from "lucide-react";

export default function KnowledgeBase() {
  const { articles, fetchArticles, createArticle, updateArticle, deleteArticle, isLoading } = useKbStore();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [formData, setFormData] = useState({ title: "", content: "", category: "General" });
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    let success;
    if (isEditingContent) {
      success = await updateArticle(editingId, formData);
    } else {
      success = await createArticle(formData);
    }
    
    if (success) {
      setShowModal(false);
      setFormData({ title: "", content: "", category: "General" });
      setIsEditingContent(false);
      setEditingId(null);
    }
  };

  const openCreateModal = () => {
    setFormData({ title: "", content: "", category: "General" });
    setIsEditingContent(false);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (article, e) => {
    e.stopPropagation();
    setFormData({ title: article.title, content: article.content, category: article.category });
    setIsEditingContent(true);
    setEditingId(article._id);
    setShowModal(true);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isStaff = user?.role === "staff" || user?.role === "admin";
  const canEdit = (article) => user?.role === "admin" || String(user?._id) === String(article.author?._id);

  return (
    <div>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Find answers to frequently asked questions</p>
        </div>
        {isStaff && (
          <button 
            onClick={openCreateModal}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            <span>New Article</span>
          </button>
        )}
      </div>

      <div className="relative mb-8 max-w-2xl">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm shadow-sm transition-all text-gray-900"
          placeholder="Search for articles, guides, or FAQs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="text-gray-500 col-span-3 text-center py-8">Loading articles...</p>
        ) : filteredArticles.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-8">No articles found matching your search.</p>
        ) : (
          filteredArticles.map(article => (
            <div 
              key={article._id} 
              onClick={() => setSelectedArticle(article)}
              className="bg-white dark:bg-[#111111] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 hover:shadow-md hover:border-primary-500/30 dark:hover:border-primary-500/30 transition-all flex flex-col h-full cursor-pointer hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-100 p-2 rounded-lg text-primary-600">
                    <BookOpen size={20} />
                  </div>
                  <span className="text-sm font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-md">{article.category}</span>
                </div>
                {canEdit(article) && (
                  <div className="flex gap-1">
                    <button 
                      onClick={(e) => openEditModal(article, e)}
                      className="text-gray-400 hover:text-primary-600 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteArticle(article._id); }}
                      className="text-red-400 hover:text-red-600 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{article.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">{article.content}</p>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-50 dark:border-neutral-800">
                By {article.author?.name || 'Staff'} • {new Date(article.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Basic Modal for Creation */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">{isEditingContent ? "Edit Article" : "Create New Article"}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text" required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                  value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium">{isEditingContent ? "Save Changes" : "Publish Article"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Article View Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 transition-all">
          <div className="bg-white dark:bg-[#111111] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col border border-gray-100 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-neutral-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#0a0a0a]">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1.5 rounded-full">{selectedArticle.category}</span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  By {selectedArticle.author?.name || 'HelpDesk Staff'} • {new Date(selectedArticle.createdAt).toLocaleDateString()}
                </div>
              </div>
              <button onClick={() => setSelectedArticle(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">&times;</button>
            </div>
            <div className="p-8 overflow-y-auto w-full prose dark:prose-invert max-w-none">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">{selectedArticle.title}</h2>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-lg leading-relaxed">{selectedArticle.content}</div>
            </div>
            <div className="px-8 py-5 border-t border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-[#0a0a0a] flex justify-end">
              <button onClick={() => setSelectedArticle(null)} className="px-6 py-2.5 bg-gray-200 dark:bg-neutral-800 hover:bg-gray-300 dark:hover:bg-neutral-700 text-gray-800 dark:text-white rounded-lg font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
