import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, setSandboxMode } from '../supabaseService';
import { authService, UserSession } from '../authService';
import { 
  Branch, 
  Product, 
  Review, 
  Founder, 
  SuccessStory, 
  ContactInfoData, 
  WebsiteSettings,
  TeamMember,
  MediaLibraryItem,
  ContactDetails
} from '../types';

import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../components/admin/Dashboard';
import BranchesAdmin from '../components/admin/BranchesAdmin';
import ProductsAdmin from '../components/admin/ProductsAdmin';
import TeamAdmin from '../components/admin/TeamAdmin';
import TestimonialsAdmin from '../components/admin/TestimonialsAdmin';
import StoriesAdmin from '../components/admin/StoriesAdmin';
import ContactAdmin from '../components/admin/ContactAdmin';
import SettingsAdmin from '../components/admin/SettingsAdmin';
import MediaLibrary from '../components/admin/MediaLibrary';

import { Check, XCircle } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Syncing state
  const [isSyncing, setIsSyncing] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // States
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Review[]>([]);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [contactDetails, setContactDetails] = useState<ContactDetails | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaLibraryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Authenticate Admin session and fetch database tables
  useEffect(() => {
    const session = authService.getCurrentSession();
    if (!session || session.role !== 'admin') {
      navigate('/admin/login');
    } else {
      setCurrentUser(session);
      loadAllData();
    }
  }, [navigate]);

  const triggerNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const loadAllData = async () => {
    setIsSyncing(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        db.getBranches(),
        db.getProducts(),
        db.getReviews(),
        db.getSuccessStories(),
        db.getTeamMembers(),
        db.getContactDetails(),
        db.getSettings(),
        db.getMediaLibrary()
      ]);

      const [branchesRes, productsRes, testimonialsRes, storiesRes, teamRes, contactsRes, settingsRes, mediaRes] = results;

      setBranches(branchesRes.status === 'fulfilled' ? branchesRes.value : []);
      setProducts(productsRes.status === 'fulfilled' ? productsRes.value : []);
      setTestimonials(testimonialsRes.status === 'fulfilled' ? testimonialsRes.value : []);
      setStories(storiesRes.status === 'fulfilled' ? storiesRes.value : []);
      setTeamMembers(teamRes.status === 'fulfilled' ? teamRes.value : []);
      setContactDetails(contactsRes.status === 'fulfilled' ? contactsRes.value : null);
      setSettings(settingsRes.status === 'fulfilled' ? settingsRes.value : null);
      setMediaItems(mediaRes.status === 'fulfilled' ? mediaRes.value : []);

      const rejected = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];
      if (rejected.length > 0) {
        const firstReason = rejected[0].reason;
        setError(firstReason?.message || String(firstReason));
        triggerNotification('error', 'One or more tables failed to sync.');
      }
    } catch (err: any) {
      console.error('Failed to sync corporate tables:', err);
      setError(err.message || String(err));
      triggerNotification('error', 'Failed database synchronization.');
    } finally {
      setIsSyncing(false);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const handleUploadMedia = async (file: File): Promise<string> => {
    try {
      const publicUrl = await db.uploadMedia(file, 'gallery-images');
      triggerNotification('success', 'File saved successfully.');
      return publicUrl;
    } catch (err) {
      triggerNotification('error', 'File upload failed.');
      throw err;
    }
  };

  // CRUD handlers
  const handleSaveBranch = async (branch: Branch) => {
    try {
      const saved = await db.saveBranch(branch);
      setBranches(prev => {
        const exists = prev.some(b => b.id === saved.id);
        return exists ? prev.map(b => b.id === saved.id ? saved : b) : [...prev, saved];
      });
      triggerNotification('success', 'Branch changes saved.');
    } catch {
      triggerNotification('error', 'Could not save branch.');
    }
  };

  const handleDeleteBranch = async (id: string) => {
    try {
      await db.deleteBranch(id);
      setBranches(prev => prev.filter(b => b.id !== id));
      triggerNotification('success', 'Branch node archived.');
    } catch {
      triggerNotification('error', 'Archival operation failed.');
    }
  };

  const handleSaveProduct = async (product: Product) => {
    try {
      const saved = await db.saveProduct(product);
      setProducts(prev => {
        const exists = prev.some(p => p.id === saved.id);
        return exists ? prev.map(p => p.id === saved.id ? saved : p) : [saved, ...prev];
      });
      triggerNotification('success', 'Product changes saved.');
    } catch {
      triggerNotification('error', 'Could not save product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await db.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      triggerNotification('success', 'Product deleted.');
    } catch {
      triggerNotification('error', 'Deletion operation failed.');
    }
  };

  const handleSaveTestimonial = async (test: Review) => {
    try {
      const saved = await db.saveReview(test);
      setTestimonials(prev => {
        const exists = prev.some(t => t.id === saved.id);
        return exists ? prev.map(t => t.id === saved.id ? saved : t) : [saved, ...prev];
      });
      triggerNotification('success', 'Testimonial saved.');
    } catch {
      triggerNotification('error', 'Could not save review.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      await db.deleteReview(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
      triggerNotification('success', 'Testimonial archived.');
    } catch {
      triggerNotification('error', 'Archival operation failed.');
    }
  };

  const handleSaveStory = async (story: SuccessStory) => {
    try {
      const saved = await db.saveSuccessStory(story);
      setStories(prev => {
        const exists = prev.some(s => s.id === saved.id);
        return exists ? prev.map(s => s.id === saved.id ? saved : s) : [...prev, saved];
      });
      triggerNotification('success', 'Success story saved.');
    } catch {
      triggerNotification('error', 'Could not save story.');
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await db.deleteSuccessStory(id);
      setStories(prev => prev.filter(s => s.id !== id));
      triggerNotification('success', 'Success story removed.');
    } catch {
      triggerNotification('error', 'Deletion operation failed.');
    }
  };

  const handleSaveTeamMember = async (member: TeamMember) => {
    try {
      const saved = await db.saveTeamMember(member);
      setTeamMembers(prev => {
        const exists = prev.some(m => m.id === saved.id);
        return exists ? prev.map(m => m.id === saved.id ? saved : m) : [...prev, saved];
      });
      triggerNotification('success', 'Team profile saved.');
    } catch {
      triggerNotification('error', 'Could not save team profile.');
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      await db.deleteTeamMember(id);
      setTeamMembers(prev => prev.filter(m => m.id !== id));
      triggerNotification('success', 'Team profile removed.');
    } catch {
      triggerNotification('error', 'Could not delete profile.');
    }
  };

  const handleSaveContact = async (c: ContactDetails) => {
    try {
      const saved = await db.saveContactDetails(c);
      setContactDetails(saved);
      triggerNotification('success', 'Support details saved.');
    } catch {
      triggerNotification('error', 'Could not save support paths.');
    }
  };

  const handleSaveSettings = async (s: WebsiteSettings) => {
    try {
      const saved = await db.saveSettings(s);
      setSettings(saved);
      triggerNotification('success', 'Site settings successfully updated.');
    } catch {
      triggerNotification('error', 'Settings save operation fell through.');
    }
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            branches={branches}
            products={products}
            testimonials={testimonials}
            reviews={stories}
            teamMembers={teamMembers}
            media={mediaItems}
            onNavigateTab={setActiveTab}
          />
        );
      case 'branches':
        return (
          <BranchesAdmin 
            branches={branches}
            onSave={handleSaveBranch}
            onDelete={handleDeleteBranch}
            onUploadMedia={handleUploadMedia}
          />
        );
      case 'products':
        return (
          <ProductsAdmin 
            products={products}
            onSave={handleSaveProduct}
            onDelete={handleDeleteProduct}
            onUploadMedia={handleUploadMedia}
          />
        );
      case 'team':
        return (
          <TeamAdmin 
            teamMembers={teamMembers}
            onSave={handleSaveTeamMember}
            onDelete={handleDeleteTeamMember}
            onUploadMedia={handleUploadMedia}
          />
        );
      case 'testimonials':
        return (
          <TestimonialsAdmin 
            testimonials={testimonials}
            onSave={handleSaveTestimonial}
            onDelete={handleDeleteTestimonial}
            onUploadMedia={handleUploadMedia}
          />
        );
      case 'stories':
        return (
          <StoriesAdmin 
            stories={stories}
            onSave={handleSaveStory}
            onDelete={handleDeleteStory}
          />
        );
      case 'contact':
        return (
          <ContactAdmin 
            contacts={contactDetails}
            onSave={handleSaveContact}
          />
        );
      case 'media':
        return (
          <MediaLibrary 
            mediaItems={mediaItems}
            onRefresh={loadAllData}
            onUploadMedia={handleUploadMedia}
          />
        );
      case 'settings':
        return (
          <SettingsAdmin 
            settings={settings}
            onSave={handleSaveSettings}
          />
        );
      default:
        return <div>Resource not found.</div>;
    }
  };

  if (isLoading && currentUser) {
    return (
      <div className="min-h-screen bg-[#050e1d] flex items-center justify-center pt-20" id="admin-spinner">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white/5 border-t-[#D4AF37] animate-spin" />
          <span className="text-xs font-mono text-[#D4AF37] uppercase tracking-widest animate-pulse">
            Syncing S7 Core Systems...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050e1d] flex items-center justify-center p-4 animate-fadeIn" id="admin-error">
        <div className="relative max-w-lg w-full bg-[#050c1e]/80 border border-red-500/20 rounded-[32px] p-8 sm:p-10 text-center backdrop-blur-xl shadow-[0_20px_50px_rgba(239,68,68,0.08)]">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-[32px] blur opacity-50 -z-10" />

          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-6 text-red-500 animate-pulse">
            <XCircle className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black font-display text-white mb-2 uppercase tracking-wider">
            S7 Sync Connection Error
          </h3>
          <p className="text-xs font-mono text-[#D4AF37] mb-6 uppercase tracking-widest">
            critical_service_failure
          </p>

          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            The admin console could not sync the corporate ecosystem tables from the remote database service. Please retry or fallback to local sandbox mode.
          </p>

          <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-4 mb-8 max-h-40 overflow-y-auto text-left">
            <p className="text-xs font-mono text-slate-400 break-words leading-relaxed">
              {error}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                loadAllData();
              }}
              className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-full font-bold transition-all duration-300 text-sm cursor-pointer"
            >
              Retry Connection
            </button>
            <button
              onClick={() => {
                setSandboxMode(true);
                setError(null);
                setIsLoading(true);
                loadAllData();
              }}
              className="flex-1 px-6 py-4 bg-[#D4AF37] hover:bg-[#c59e2b] text-[#050c1e] rounded-full font-bold shadow-lg shadow-amber-500/10 transition-all duration-300 text-sm cursor-pointer"
            >
              Fallback to Sandbox
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
      adminEmail={currentUser?.email}
      settings={settings}
    >
      {/* Toast Notification HUD alert */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border flex items-center gap-2.5 text-xs font-mono font-bold uppercase shadow-2xl animate-in slide-in-from-bottom-5 duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {notification.type === 'success' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-red-400" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {renderActivePanel()}
    </AdminLayout>
  );
}
