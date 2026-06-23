import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, MapPin, Phone, Mail, Link as LinkIcon, X, ArrowUp, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Branch } from '../../types';
import ImageUploader from './ImageUploader';

interface BranchesAdminProps {
  branches: Branch[];
  onSave: (branch: Branch) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onUploadMedia: (file: File) => Promise<string>;
}

export default function BranchesAdmin({
  branches = [],
  onSave,
  onDelete,
  onUploadMedia
}: BranchesAdminProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Create / Edit Form State
  const [formState, setFormState] = useState<Omit<Branch, 'id'>>({
    name: '',
    location: '', // maps to map_link
    address: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
    phone: '',
    email: '',
    city: '',
    state: '',
    display_order: 0,
    is_active: true
  });

  const resetForm = (order = 0) => {
    setFormState({
      name: '',
      location: '',
      address: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      phone: '',
      email: '',
      city: '',
      state: '',
      display_order: order,
      is_active: true
    });
    setErrorMsg(null);
  };

  const handleOpenAdd = () => {
    const maxOrder = branches.reduce((max, b) => (b.display_order || 0) > max ? (b.display_order || 0) : max, 0);
    resetForm(maxOrder + 1);
    setShowAddForm(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setErrorMsg(null);
    setEditingBranch(branch);
    setFormState({
      name: branch.name,
      location: branch.location || '',
      address: branch.address || '',
      description: branch.description,
      image_url: branch.image_url,
      phone: branch.phone,
      email: branch.email || '',
      city: branch.city || '',
      state: branch.state || '',
      display_order: branch.display_order || 0,
      is_active: branch.is_active !== undefined ? branch.is_active : true
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const payload: Branch = {
        id: editingBranch ? editingBranch.id : 'b-' + Date.now(),
        ...formState
      };
      await onSave(payload);
      setShowAddForm(false);
      setEditingBranch(null);
      resetForm();
    } catch (err: any) {
      console.error('Error saving branch details', err);
      setErrorMsg(err?.message || 'Failed to save branch node. Please check your data.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= branches.length) return;

    // We sort the branches array to match display_order logic
    const sortedBranches = [...branches].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    const currentBranch = { ...sortedBranches[index] };
    const siblingBranch = { ...sortedBranches[targetIndex] };

    // Swap orders
    const temp = currentBranch.display_order;
    currentBranch.display_order = siblingBranch.display_order;
    siblingBranch.display_order = temp;

    if (currentBranch.display_order === siblingBranch.display_order) {
      if (direction === 'up') {
        currentBranch.display_order = Math.max(0, (siblingBranch.display_order || 0) - 1);
      } else {
        currentBranch.display_order = (siblingBranch.display_order || 0) + 1;
      }
    }

    await onSave(currentBranch);
    await onSave(siblingBranch);
  };

  return (
    <div className="space-y-6 text-left" id="admin-branches-management">
      
      {/* Tab Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Branches Registry</h2>
          <p className="text-slate-400 text-xs mt-1">Deploy, update, or archive company workspace coordinates.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest bg-[#D4AF37] text-slate-950 hover:bg-amber-500 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Hub Node</span>
        </button>
      </div>

      {/* CRUD Modal Form (Add / Edit) */}
      {(showAddForm || editingBranch) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#090d1f] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">
                {editingBranch ? 'Edit Hub Details' : 'Deploy New Hub Node'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingBranch(null); }}
                className="p-1 rounded-lg border border-slate-850 hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Hub Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Contact Phone Number</label>
                  <input
                    type="text"
                    required
                    value={formState.phone}
                    onChange={e => setFormState({ ...formState, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">Electronic Mail Address</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">Google Maps Link</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={formState.location}
                    onChange={e => setFormState({ ...formState, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">City</label>
                  <input
                    type="text"
                    required
                    value={formState.city}
                    onChange={e => setFormState({ ...formState, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">State</label>
                  <input
                    type="text"
                    value={formState.state}
                    onChange={e => setFormState({ ...formState, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase">Physical Address</label>
                <input
                  type="text"
                  required
                  value={formState.address}
                  onChange={e => setFormState({ ...formState, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase font-bold block">Document image / layout URL</label>
                <ImageUploader
                  value={formState.image_url}
                  onChange={url => setFormState(prev => ({ ...prev, image_url: url }))}
                  bucketName="branch-images"
                  rounded={false}
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase">Overview Description</label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={e => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                <div className="flex items-center space-x-3 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formState.is_active}
                    onChange={e => setFormState({ ...formState, is_active: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 accent-[#D4AF37] cursor-pointer"
                  />
                  <label htmlFor="is_active" className="text-[10px] font-mono text-slate-400 uppercase cursor-pointer selection:bg-transparent">Active Hub Node</label>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-950/20 border border-red-900/35 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/60">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => { setShowAddForm(false); setEditingBranch(null); }}
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
                  <span>{editingBranch ? 'Save Hub' : 'Deploy Hub'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hub list table grid */}
      <div className="bg-[#090d1f]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 font-mono tracking-wider text-slate-505 uppercase">
                <th className="p-4">Visual Layout</th>
                <th className="p-4">Hub Name / Location</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Order / Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans text-slate-300">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No branches currently indexed in directories.
                  </td>
                </tr>
              ) : (
                (() => {
                  const sortedBranches = [...branches].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                  return sortedBranches.map((branch, index) => (
                    <tr key={branch.id} className="hover:bg-slate-800/10">
                      <td className="p-4">
                        <img 
                          src={branch.image_url} 
                          alt={branch.name} 
                          className="w-16 h-10 object-cover rounded-xl border border-slate-850 bg-slate-950" 
                        />
                      </td>
                      <td className="p-4 text-left">
                        <div className="font-bold text-white text-sm">{branch.name}</div>
                        <div className="text-[10px] text-slate-550 mt-0.5">{branch.address}</div>
                      </td>
                      <td className="p-4 font-mono">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>{branch.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-505 mt-1">
                          <Mail className="w-3.5 h-3.5 text-slate-505" />
                          <span>{branch.email}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono">
                        <div className="text-slate-400">Order: {branch.display_order || 0}</div>
                        <div className="mt-1">
                          {branch.is_active !== false ? (
                            <span className="inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase tracking-wider">Active</span>
                          ) : (
                            <span className="inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-500/10 border border-slate-800 text-slate-505 uppercase tracking-wider">Inactive</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          {branch.location && (
                            <a 
                              href={branch.location} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800/40 transition-colors"
                              title="Open Google Maps"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
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
                            disabled={index === sortedBranches.length - 1}
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800/40 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(branch)}
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors cursor-pointer"
                            title="Edit Hub"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { if (window.confirm(`Delete ${branch.name}?`)) onDelete(branch.id); }}
                            className="p-2 rounded-xl border border-slate-800 text-slate-450 hover:text-red-400 hover:border-red-950 hover:bg-red-950/20 transition-colors cursor-pointer"
                            title="Delete Hub"
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
