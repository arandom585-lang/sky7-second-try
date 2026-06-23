import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Star, Award, X } from 'lucide-react';
import { SuccessStory } from '../../types';
import ImageUploader from './ImageUploader';

interface StoriesAdminProps {
  stories: SuccessStory[];
  onSave: (story: SuccessStory) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

export default function StoriesAdmin({
  stories = [],
  onSave,
  onDelete,
}: StoriesAdminProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);

  // Form states
  const [formState, setFormState] = useState<Omit<SuccessStory, 'id'>>({
    name: '',
    achievement: '',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    stars: 5
  });

  const resetForm = () => {
    setFormState({
      name: '',
      achievement: '',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      stars: 5
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleOpenEdit = (story: SuccessStory) => {
    setEditingStory(story);
    setFormState({
      name: story.name,
      achievement: story.achievement,
      image: story.image,
      stars: story.stars
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: SuccessStory = {
        id: editingStory ? editingStory.id : 's-' + Date.now(),
        ...formState
      };
      await onSave(payload);
      setShowAddForm(false);
      setEditingStory(null);
      resetForm();
    } catch (err) {
      console.error('Error saving success story', err);
    }
  };

  return (
    <div className="space-y-6 text-left" id="admin-stories-management">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Success Stories Registry</h2>
          <p className="text-slate-400 text-xs mt-1">Audit or log network achievement cards and badges.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest bg-[#D4AF37] text-slate-950 hover:bg-amber-500 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Publish Story</span>
        </button>
      </div>

      {/* Form modal (Add / Edit) */}
      {(showAddForm || editingStory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#090d1f] border border-slate-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200 font-sans text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">
                {editingStory ? 'Edit Success Story' : 'Publish Success Story Card'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingStory(null); }}
                className="p-1 rounded-lg border border-slate-850 hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Achiever Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Achiever Name</label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              {/* Achievement Badge Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Achievement Badge Title (e.g. MacBook Achiever)</label>
                <input
                  type="text"
                  required
                  value={formState.achievement}
                  onChange={e => setFormState({ ...formState, achievement: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              {/* Rating stars */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase">Rating Stars</label>
                <select
                  value={formState.stars}
                  onChange={e => setFormState({ ...formState, stars: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 focus:outline-none"
                >
                  {[5, 4, 3, 2, 1].map((s) => (
                    <option key={s} value={s}>{s} Stars</option>
                  ))}
                </select>
              </div>

              {/* Image URL path & Upload */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-500 uppercase font-bold block mb-1">Achiever Profile Photo</label>
                <ImageUploader
                  value={formState.image}
                  onChange={url => {
                    setFormState(prev => ({ ...prev, image: url }));
                    if (editingStory) {
                      setEditingStory(prev => prev ? ({ ...prev, image: url }) : null);
                    }
                  }}
                  bucketName="gallery-images"
                  rounded={true}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/60 font-mono font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingStory(null); }}
                  className="px-4 py-2.5 rounded-xl text-xs hover:bg-slate-900 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs bg-white text-slate-950 hover:bg-slate-100 cursor-pointer"
                >
                  Save Story
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stories list */}
      <div className="bg-[#090d1f]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 font-mono tracking-wider text-slate-500 uppercase">
                <th className="p-4">Visual Photo</th>
                <th className="p-4">Achiever Name</th>
                <th className="p-4">Badge Achievement</th>
                <th className="p-4">Rating Stars</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans text-slate-300">
              {stories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No success stories currently indexed.
                  </td>
                </tr>
              ) : (
                stories.map((story) => (
                  <tr key={story.id} className="hover:bg-slate-800/10">
                    <td className="p-4">
                      <div className="relative h-12 w-12 shrink-0">
                        <img 
                          src={story.image} 
                          alt={story.name} 
                          className="h-full w-full object-cover rounded-full border border-slate-800 bg-slate-950" 
                        />
                        <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-[#173B8C] text-white flex items-center justify-center border border-slate-850 shadow-sm">
                          <Award className="h-2.5 w-2.5 text-white" />
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-left font-bold text-white text-sm">
                      {story.name}
                    </td>
                    <td className="p-4 font-mono">
                      <span className="inline-flex items-center rounded-full bg-blue-950 border border-blue-900/60 px-2.5 py-0.5 text-[9px] font-bold text-[#D4AF37] tracking-wide uppercase">
                        {story.achievement}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: story.stars || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(story)}
                          className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors cursor-pointer"
                          title="Edit Story"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete success story of ${story.name}?`)) onDelete(story.id); }}
                          className="p-2 rounded-xl border border-slate-800 text-slate-450 hover:text-red-400 hover:border-red-950 hover:bg-red-950/20 transition-colors cursor-pointer"
                          title="Delete Story"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
