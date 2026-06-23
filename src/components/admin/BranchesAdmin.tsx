import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, MapPin, Phone, Mail, Link as LinkIcon, X } from 'lucide-react';
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
  
  // Create / Edit Form State
  const [formState, setFormState] = useState<Omit<Branch, 'id'>>({
    name: '',
    location: '', // used for maps link
    address: '',
    description: '',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
    phone: '',
    email: ''
  });

  const resetForm = () => {
    setFormState({
      name: '',
      location: '',
      address: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
      phone: '',
      email: ''
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setEditingBranch(branch);
    setFormState({
      name: branch.name,
      location: branch.location || '',
      address: branch.address || '',
      description: branch.description,
      image_url: branch.image_url,
      phone: branch.phone,
      email: branch.email || ''
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: Branch = {
        id: editingBranch ? editingBranch.id : 'b-' + Date.now(),
        ...formState
      };
      await onSave(payload);
      setShowAddForm(false);
      setEditingBranch(null);
      resetForm();
    } catch (err) {
      console.error('Error saving branch details', err);
    }
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
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Electronic Mail Address</label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={e => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Google Maps Link</label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/?q=..."
                    value={formState.location}
                    onChange={e => setFormState({ ...formState, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none"
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

              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingBranch(null); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-slate-900 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-white text-slate-950 hover:bg-slate-100 cursor-pointer"
                >
                  {editingBranch ? 'Save Hub' : 'Deploy Hub'}
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
              <tr className="bg-slate-950/80 border-b border-slate-800 font-mono tracking-wider text-slate-500 uppercase">
                <th className="p-4">Visual Layout</th>
                <th className="p-4">Hub Name / Location</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans text-slate-300">
              {branches.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No branches currently indexed in directories.
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
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
                      <div className="text-[10px] text-slate-500 mt-0.5">{branch.address}</div>
                    </td>
                    <td className="p-4 font-mono">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>{branch.phone}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 mt-1">
                        <Mail className="w-3.5 h-3.5 text-slate-500" />
                        <span>{branch.email}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        {branch.location && (
                          <a 
                            href={branch.location} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors"
                            title="Open Google Maps"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
