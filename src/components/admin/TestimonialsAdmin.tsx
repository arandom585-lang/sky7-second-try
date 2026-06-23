import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Star, MessageSquare, X, ArrowUp, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Review } from '../../types';
import ImageUploader from './ImageUploader';

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
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formState, setFormState] = useState<Omit<Review, 'id'>>({
    author: '',
    role: 'Franchise Owner',
    company: '',
    rating: 5,
    text: '',
    date: new Date().toISOString().split('T')[0],
    verified: true,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
    display_order: 0,
    is_featured: false,
    is_active: true
  });

  const resetForm = (order = 0) => {
    setFormState({
      author: '',
      role: 'Franchise Owner',
      company: '',
      rating: 5,
      text: '',
      date: new Date().toISOString().split('T')[0],
      verified: true,
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
      display_order: order,
      is_featured: false,
      is_active: true
    });
    setErrorMsg(null);
  };

  const handleOpenAdd = () => {
    const maxOrder = testimonials.reduce((max, t) => (t.display_order || 0) > max ? (t.display_order || 0) : max, 0);
    resetForm(maxOrder + 1);
    setShowAddForm(true);
  };

  const handleOpenEdit = (testimonial: Review) => {
    setErrorMsg(null);
    setEditingTestimonial(testimonial);
    setFormState({
      author: testimonial.author,
      role: testimonial.role,
      company: testimonial.company,
      rating: testimonial.rating,
      text: testimonial.text,
      date: testimonial.date || new Date().toISOString().split('T')[0],
      verified: !!testimonial.verified,
      image_url: testimonial.image_url,
      display_order: testimonial.display_order || 0,
      is_featured: !!testimonial.is_featured,
      is_active: testimonial.is_active !== false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const payload: Review = {
        id: editingTestimonial ? editingTestimonial.id : 't-' + Date.now(),
        ...formState
      };
      await onSave(payload);
      setShowAddForm(false);
      setEditingTestimonial(null);
      resetForm();
    } catch (err: any) {
      console.error('Error saving testimonial', err);
      setErrorMsg(err?.message || 'Failed to save testimonial details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= testimonials.length) return;

    const sortedTestimonials = [...testimonials].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    const currentTest = { ...sortedTestimonials[index] };
    const siblingTest = { ...sortedTestimonials[targetIndex] };

    // Swap orders
    const temp = currentTest.display_order;
    currentTest.display_order = siblingTest.display_order;
    siblingTest.display_order = temp;

    if (currentTest.display_order === siblingTest.display_order) {
      if (direction === 'up') {
        currentTest.display_order = Math.max(0, (siblingTest.display_order || 0) - 1);
      } else {
        currentTest.display_order = (siblingTest.display_order || 0) + 1;
      }
    }

    await onSave(currentTest);
    await onSave(siblingTest);
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
                <ImageUploader
                  value={formState.image_url}
                  onChange={url => setFormState(prev => ({ ...prev, image_url: url }))}
                  bucketName="founders-images"
                  rounded={true}
                />
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

              {/* Display Order, Featured and Active Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">Display Order</label>
                  <input
                    type="number"
                    required
                    value={formState.display_order}
                    onChange={e => setFormState({ ...formState, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formState.is_featured}
                    onChange={e => setFormState({ ...formState, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 accent-[#D4AF37] cursor-pointer"
                  />
                  <label htmlFor="is_featured" className="text-[10px] font-mono text-slate-400 uppercase cursor-pointer selection:bg-transparent">Featured Spotlight</label>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formState.is_active}
                    onChange={e => setFormState({ ...formState, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 accent-[#D4AF37] cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-[10px] font-mono text-slate-400 uppercase cursor-pointer selection:bg-transparent">Active Listing</label>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-950/20 border border-red-900/35 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/60">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => { setShowAddForm(false); setEditingTestimonial(null); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-slate-900 text-slate-400 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-100 cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingTestimonial ? 'Save Testimonial' : 'Publish Feedback'}</span>
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
              <tr className="bg-slate-950/80 border-b border-slate-800 font-mono tracking-wider text-slate-505 uppercase">
                <th className="p-4">Customer Avatar</th>
                <th className="p-4">Name / Designation</th>
                <th className="p-4">Review content excerpt</th>
                <th className="p-4">Rating Stars</th>
                <th className="p-4">Order / Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans text-slate-300">
              {testimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No testimonials currently configured in the database.
                  </td>
                </tr>
              ) : (
                (() => {
                  const sortedTestimonials = [...testimonials].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                  return sortedTestimonials.map((test, index) => (
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
                        <div className="text-[10px] text-slate-550 mt-0.5">{test.role}, {test.company}</div>
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
                      <td className="p-4 font-mono">
                        <div className="text-slate-400">Order: {test.display_order || 0}</div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {test.is_featured && (
                            <span className="inline-flex px-1.5 py-0.5 text-[8px] font-bold rounded bg-amber-500/10 border border-amber-500/25 text-[#D4AF37] uppercase tracking-wider">Featured</span>
                          )}
                          {test.is_active !== false ? (
                            <span className="inline-flex px-1.5 py-0.5 text-[8px] font-bold rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase tracking-wider">Active</span>
                          ) : (
                            <span className="inline-flex px-1.5 py-0.5 text-[8px] font-bold rounded bg-slate-500/10 border border-slate-800 text-slate-505 uppercase tracking-wider">Inactive</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800/40 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === sortedTestimonials.length - 1}
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800/40 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
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
                  ));
                })()
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
