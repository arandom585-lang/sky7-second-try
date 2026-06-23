import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Link as LinkIcon, X, ArrowUp, ArrowDown, Mail, Briefcase, User, RefreshCw, AlertCircle } from 'lucide-react';
import { TeamMember } from '../../types';
import ImageUploader from './ImageUploader';

interface TeamAdminProps {
  teamMembers: TeamMember[];
  onSave: (member: TeamMember) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onUploadMedia: (file: File) => Promise<string>;
}

export default function TeamAdmin({
  teamMembers = [],
  onSave,
  onDelete,
  onUploadMedia
}: TeamAdminProps) {
  const [activeSubTab, setActiveSubTab] = useState<'founders' | 'team'>('founders');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Form State
  const [formState, setFormState] = useState<Omit<TeamMember, 'id'>>({
    type: 'founder',
    name: '',
    role: '',
    bio: '',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600',
    linkedin_url: '',
    email: '',
    department: '',
    social_links: {},
    display_order: 0
  });

  const [socialTwitter, setSocialTwitter] = useState('');
  const [socialGithub, setSocialGithub] = useState('');

  const resetForm = (type: 'founder' | 'co-founder' | 'team_member') => {
    // Get max display order for sorting fallback
    const maxOrder = teamMembers.reduce((max, m) => m.display_order > max ? m.display_order : max, 0);
    setFormState({
      type,
      name: '',
      role: '',
      bio: '',
      image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600',
      linkedin_url: '',
      email: '',
      department: '',
      social_links: {},
      display_order: maxOrder + 1
    });
    setSocialTwitter('');
    setSocialGithub('');
    setErrorMsg(null);
  };

  const handleOpenAdd = () => {
    resetForm(activeSubTab === 'founders' ? 'founder' : 'team_member');
    setShowAddForm(true);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setErrorMsg(null);
    setEditingMember(member);
    setFormState({
      type: member.type,
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url,
      linkedin_url: member.linkedin_url || '',
      email: member.email || '',
      department: member.department || '',
      social_links: member.social_links || {},
      display_order: member.display_order
    });

    const parsedSocials = typeof member.social_links === 'string' 
      ? JSON.parse(member.social_links || '{}') 
      : member.social_links || {};
    
    setSocialTwitter(parsedSocials.twitter || '');
    setSocialGithub(parsedSocials.github || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const socialObj: { [key: string]: string } = {};
      if (socialTwitter.trim()) socialObj.twitter = socialTwitter.trim();
      if (socialGithub.trim()) socialObj.github = socialGithub.trim();

      const payload: TeamMember = {
        id: editingMember ? editingMember.id : 't-' + Date.now(),
        ...formState,
        social_links: socialObj
      };
      
      await onSave(payload);
      setShowAddForm(false);
      setEditingMember(null);
    } catch (err: any) {
      console.error('Error saving team member details', err);
      setErrorMsg(err?.message || 'Failed to save team member details. Please verify your data.');
    } finally {
      setIsSaving(false);
    }
  };

  // Move display order up or down to support reordering
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredMembers.length) return;

    const currentMember = { ...filteredMembers[index] };
    const siblingMember = { ...filteredMembers[targetIndex] };

    // Swap display orders
    const temp = currentMember.display_order;
    currentMember.display_order = siblingMember.display_order;
    siblingMember.display_order = temp;

    // If order values are same, assign sequential values
    if (currentMember.display_order === siblingMember.display_order) {
      if (direction === 'up') {
        currentMember.display_order = Math.max(0, siblingMember.display_order - 1);
      } else {
        currentMember.display_order = siblingMember.display_order + 1;
      }
    }

    await onSave(currentMember);
    await onSave(siblingMember);
  };

  // Filter members by subtab
  const filteredMembers = teamMembers
    .filter(m => activeSubTab === 'founders' ? (m.type === 'founder' || m.type === 'co-founder') : m.type === 'team_member')
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300" id="admin-team-management">
      
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-slate-900">Founders & Team Registry</h2>
          <p className="text-slate-500 text-xs mt-1">Manage bios, corporate roles, and sorting preferences for display tables.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest bg-[#4F8CFF] text-white hover:bg-blue-600 cursor-pointer shadow-lg shadow-blue-500/10 hover:scale-[1.01] transition-all"
        >
          <Plus className="w-4 h-4 text-white" />
          <span>Add Member Profile</span>
        </button>
      </div>

      {/* Subtab navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveSubTab('founders')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
            activeSubTab === 'founders'
              ? 'bg-[#EAF3FF] text-[#4F8CFF] border-[#4F8CFF]/20'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Founders & Co-Founders
        </button>
        <button
          onClick={() => setActiveSubTab('team')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase border transition-all cursor-pointer ${
            activeSubTab === 'team'
              ? 'bg-[#EAF3FF] text-[#4F8CFF] border-[#4F8CFF]/20'
              : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
          }`}
        >
          Leadership / Team
        </button>
      </div>

      {/* Edit Form Modal */}
      {(showAddForm || editingMember) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-sm font-mono font-bold text-slate-900 uppercase tracking-widest">
                {editingMember ? 'Modify Team Profile' : 'Create Team Profile'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingMember(null); }}
                className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl text-xs text-rose-500 font-medium flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Profile Type</label>
                  <select
                    value={formState.type}
                    onChange={e => setFormState({ ...formState, type: e.target.value as any })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                  >
                    <option value="founder">Founder</option>
                    <option value="co-founder">Co-Founder</option>
                    <option value="team_member">Team Member</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Display Order (Sorting)</label>
                  <input
                    type="number"
                    required
                    value={formState.display_order}
                    onChange={e => setFormState({ ...formState, display_order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    placeholder="e.g. Sudhakar Rao"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">
                    {formState.type === 'team_member' ? 'Role' : 'Designation'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.role}
                    onChange={e => setFormState({ ...formState, role: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    placeholder={formState.type === 'team_member' ? 'e.g. Senior Software Architect' : 'e.g. Managing Director'}
                  />
                </div>
              </div>

              {formState.type === 'team_member' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Department</label>
                    <input
                      type="text"
                      value={formState.department}
                      onChange={e => setFormState({ ...formState, department: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                      placeholder="e.g. Operations / Technology"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Contact Email</label>
                    <input
                      type="email"
                      value={formState.email}
                      onChange={e => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                      placeholder="e.g. member@sky7.com"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={formState.linkedin_url}
                    onChange={e => setFormState({ ...formState, linkedin_url: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              )}

              {formState.type === 'team_member' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Twitter Handle URL (Optional)</label>
                    <input
                      type="url"
                      value={socialTwitter}
                      onChange={e => setSocialTwitter(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                      placeholder="https://twitter.com/..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">GitHub Profile URL (Optional)</label>
                    <input
                      type="url"
                      value={socialGithub}
                      onChange={e => setSocialGithub(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Profile Image</label>
                <ImageUploader
                  value={formState.image_url}
                  onChange={url => setFormState(prev => ({ ...prev, image_url: url }))}
                  bucketName="founders-images"
                  rounded={true}
                />
              </div>

              {formState.type !== 'team_member' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Executive Biography (Bio)</label>
                  <textarea
                    rows={4}
                    value={formState.bio}
                    onChange={e => setFormState({ ...formState, bio: e.target.value })}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none resize-none"
                    placeholder="Enter biography description..."
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingMember(null); }}
                  className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:bg-slate-50 text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest bg-[#4F8CFF] text-white hover:bg-blue-600 cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {isSaving && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingMember ? 'Update Profile' : 'Publish Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Directory list layout table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-mono tracking-wider text-slate-500 uppercase">
                <th className="p-4 w-20">Avatar</th>
                <th className="p-4">Name</th>
                <th className="p-4">Role / Department</th>
                <th className="p-4 w-28">Order</th>
                <th className="p-4 text-right w-36">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans text-slate-700">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 font-mono text-xs">
                    No matching profiles found in this directory segment.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member, idx) => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <img 
                        src={member.image_url} 
                        alt={member.name} 
                        className="w-10 h-10 object-cover rounded-full border border-slate-200 bg-slate-50" 
                      />
                    </td>
                    <td className="p-4 text-left">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{member.name}</span>
                        {member.type !== 'team_member' && (
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[8px] font-mono font-bold uppercase tracking-wider text-[#4F8CFF] border border-blue-100/50">
                            {member.type}
                          </span>
                        )}
                      </div>
                      {member.type === 'team_member' && member.email && (
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-350" />
                          <span>{member.email}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-800">{member.role}</div>
                      {member.department && (
                        <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-slate-350" />
                          <span>{member.department}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMoveOrder(idx, 'up')}
                          className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-slate-50 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === filteredMembers.length - 1}
                          onClick={() => handleMoveOrder(idx, 'down')}
                          className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-slate-50 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        {member.linkedin_url && (
                          <a 
                            href={member.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-[#4F8CFF] hover:bg-[#EAF3FF]/40 transition-colors"
                          >
                            <LinkIcon className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <button
                          onClick={() => handleOpenEdit(member)}
                          className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-[#4F8CFF] hover:bg-[#EAF3FF]/40 hover:border-[#4F8CFF]/20 transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete profile for ${member.name}?`)) onDelete(member.id); }}
                          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-red-650 hover:border-red-100 hover:bg-red-50/50 transition-all cursor-pointer"
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
