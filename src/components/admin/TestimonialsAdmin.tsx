import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Star, MessageSquare, X } from 'lucide-react';
import { Review } from '../../types';

interface TestimonialsAdminProps {
  testimonials: Review[];
  onSave: (testimonial: Review) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onUploadMedia: (file: File) => Promise<string>;
}

export default function TestimonialsAdmin({
  testimonials = [],
  onSave,
  onDelete,
  onUploadMedia
}: TestimonialsAdminProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Review | null>(null);

  // Form states
  const [formState, setFormState] = useState<Omit<Review, 'id'>>({
    author: '',
    role: 'Franchise Owner',
    company: '',
    rating: 5,
    text: '',
    date: new Date().toISOString().split('T')[0],
    verified: true,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'
  });

  const resetForm = () => {
    setFormState({
      author: '',
      role: 'Franchise Owner',
      company: '',
      rating: 5,
      text: '',
      date: new Date().toISOString().split('T')[0],
      verified: true,
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleOpenEdit = (testimonial: Review) => {
    setEditingTestimonial(testimonial);
    setFormState({
      author: testimonial.author,
      role: testimonial.role,
      company: testimonial.company,
      rating: testimonial.rating,
      text: testimonial.text,
      date: testimonial.date || new Date().toISOString().split('T')[0],
      verified: !!testimonial.verified,
      image_url: testimonial.image_url
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const publicUrl = await onUploadMedia(file);
      setFormState(prev => ({ ...prev, image_url: publicUrl }));
      if (isEdit && editingTestimonial) {
        setEditingTestimonial(prev => prev ? ({ ...prev, image_url: publicUrl }) : null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Review = {
        id: editingTestimonial ? editingTestimonial.id : 't-' + Date.now(),
        ...formState
      };
      await onSave(payload);
      setShowAddForm(false);
      setEditingTestimonial(null);
      resetForm();
    } catch (err) {
      console.error('Error saving testimonial', err);
    }
  };

  return (
    <div className="space-y-6 text-left" id="admin-testimonials-management">
      
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Testimonials & Reviews</h2>
          <p className="text-slate-400 text-xs mt-1">Audit or log client feedback for dynamic sliders.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest bg-[#D4AF37] text-slate-950 hover:bg-amber-500 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Publish Feedback</span>
        </button>
      </div>

      {/* CRUD modal form (Add / Edit) */}
      {(showAddForm || editingTestimonial) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#090d1f] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">
                {editingTestimonial ? 'Edit Testimonial' : 'Publish Testimonial feedback'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingTestimonial(null); }}
                className="p-1 rounded-lg border border-slate-850 hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Author Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Customer Name</label>
                  <input
                    type="text"
                    required
                    value={formState.author}
                    onChange={e => setFormState({ ...formState, author: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                {/* Designation Role */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Designation / Role</label>
                  <input
                    type="text"
                    required
                    value={formState.role}
                    onChange={e => setFormState({ ...formState, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Company Entity</label>
                  <input
                    type="text"
                    required
                    value={formState.company}
                    onChange={e => setFormState({ ...formState, company: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Rating selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Star Rating</label>
                  <select
                    value={formState.rating}
                    onChange={e => setFormState({ ...formState, rating: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                {/* Verified badge toggle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Verified status</label>
                  <select
                    value={formState.verified ? 'true' : 'false'}
                    onChange={e => setFormState({ ...formState, verified: e.target.value === 'true' })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 focus:outline-none"
                  >
                    <option value="true">Include Verified badge</option>
                    <option value="false">No badge</option>
                  </select>
                </div>

                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Feedback Date</label>
                  <input
                    type="date"
                    required
                    value={formState.date}
                    onChange={e => setFormState({ ...formState, date: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

              </div>

              {/* Image Upload */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase font-bold block">Customer Image URL</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formState.image_url}
                    onChange={e => setFormState({ ...formState, image_url: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      id="testimonial-upload-field"
                      onChange={e => handleFileChange(e, !!editingTestimonial)}
                      className="hidden"
                    />
                    <label htmlFor="testimonial-upload-field" className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 cursor-pointer flex items-center gap-1.5 text-slate-300 text-xs font-mono font-bold uppercase tracking-wider">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase">Feedback review text</label>
                <textarea
                  rows={3}
                  required
                  value={formState.text}
                  onChange={e => setFormState({ ...formState, text: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingTestimonial(null); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-slate-900 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-100 cursor-pointer"
                >
                  Publish Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonials List */}
      <div className="bg-[#090d1f]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 font-mono tracking-wider text-slate-500 uppercase">
                <th className="p-4">Customer Avatar</th>
                <th className="p-4">Name / Designation</th>
                <th className="p-4">Review content excerpt</th>
                <th className="p-4">Rating Stars</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans text-slate-300">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No testimonials currently configured in the database.
                  </td>
                </tr>
              ) : (
                testimonials.map((test) => (
                  <tr key={test.id} className="hover:bg-slate-800/10">
                    <td className="p-4">
                      <img 
                        src={test.image_url || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200'} 
                        alt={test.author} 
                        className="w-10 h-10 object-cover rounded-full border border-slate-850 bg-slate-950" 
                      />
                    </td>
                    <td className="p-4 text-left">
                      <div className="font-bold text-white text-sm">{test.author}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{test.role}, {test.company}</div>
                    </td>
                    <td className="p-4 italic max-w-sm truncate text-slate-400">
                      "{test.text}"
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: test.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(test)}
                          className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors cursor-pointer"
                          title="Edit Feedback"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete review from ${test.author}?`)) onDelete(test.id); }}
                          className="p-2 rounded-xl border border-slate-800 text-slate-450 hover:text-red-400 hover:border-red-950 hover:bg-red-950/20 transition-colors cursor-pointer"
                          title="Delete Feedback"
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
