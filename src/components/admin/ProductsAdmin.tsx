import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Tag, Star, Sparkles, X, ArrowUp, ArrowDown, RefreshCw, AlertCircle } from 'lucide-react';
import { Product } from '../../types';
import ImageUploader from './ImageUploader';

interface ProductsAdminProps {
  products: Product[];
  onSave: (product: Product) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
  onUploadMedia: (file: File) => Promise<string>;
}

export default function ProductsAdmin({
  products = [],
  onSave,
  onDelete,
  onUploadMedia
}: ProductsAdminProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [formState, setFormState] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    image_url: '/images/sky_seven_water.jpg',
    price: '20 Rs',
    partner_link: '',
    category: 'Beverage',
    features: ['100% Pure & Filtered', 'Premium Quality Standards'],
    specs: { Capacity: '500 ml / 1 L', Source: 'Natural Springs' },
    whatsapp_number: '919999999999',
    is_featured: true,
    display_order: 0,
    is_active: true,
    full_description: '',
    brochure_url: ''
  });

  // Custom key-value input helpers for specs
  const [newFeature, setNewFeature] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');

  const resetForm = (order = 0) => {
    setFormState({
      name: '',
      description: '',
      image_url: '/images/sky_seven_water.jpg',
      price: '',
      partner_link: '',
      category: 'Beverage',
      features: [],
      specs: {},
      whatsapp_number: '919999999999',
      is_featured: false,
      display_order: order,
      is_active: true,
      full_description: '',
      brochure_url: ''
    });
    setNewFeature('');
    setNewSpecKey('');
    setNewSpecVal('');
    setErrorMsg(null);
  };

  const handleOpenAdd = () => {
    const maxOrder = products.reduce((max, p) => (p.display_order || 0) > max ? (p.display_order || 0) : max, 0);
    resetForm(maxOrder + 1);
    setShowAddForm(true);
  };

  const handleOpenEdit = (product: Product) => {
    setErrorMsg(null);
    setEditingProduct(product);
    setFormState({
      name: product.name,
      description: product.description,
      image_url: product.image_url,
      price: product.price,
      partner_link: product.partner_link || '',
      category: product.category,
      features: product.features || [],
      specs: product.specs || {},
      whatsapp_number: product.whatsapp_number || '919999999999',
      is_featured: !!product.is_featured,
      display_order: product.display_order || 0,
      is_active: product.is_active !== false,
      full_description: product.full_description || '',
      brochure_url: product.brochure_url || ''
    });
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setFormState(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeFeature = (idx: number) => {
    setFormState(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const addSpec = () => {
    if (!newSpecKey.trim() || !newSpecVal.trim()) return;
    setFormState(prev => ({
      ...prev,
      specs: {
        ...prev.specs,
        [newSpecKey.trim()]: newSpecVal.trim()
      }
    }));
    setNewSpecKey('');
    setNewSpecVal('');
  };

  const removeSpec = (key: string) => {
    setFormState(prev => {
      const specsCopy = { ...prev.specs };
      delete specsCopy[key];
      return { ...prev, specs: specsCopy };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    try {
      const link = formState.partner_link || `/contact?subject=Product_${formState.name.replace(/\s+/g, '_')}`;
      const payload: Product = {
        id: editingProduct ? editingProduct.id : 'p-' + Date.now(),
        ...formState,
        partner_link: link
      };
      await onSave(payload);
      setShowAddForm(false);
      setEditingProduct(null);
      resetForm();
    } catch (err: any) {
      console.error('Error saving product', err);
      setErrorMsg(err?.message || 'Failed to save product details.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const sortedProducts = [...products].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));

    const currentProduct = { ...sortedProducts[index] };
    const siblingProduct = { ...sortedProducts[targetIndex] };

    // Swap orders
    const temp = currentProduct.display_order;
    currentProduct.display_order = siblingProduct.display_order;
    siblingProduct.display_order = temp;

    if (currentProduct.display_order === siblingProduct.display_order) {
      if (direction === 'up') {
        currentProduct.display_order = Math.max(0, (siblingProduct.display_order || 0) - 1);
      } else {
        currentProduct.display_order = (siblingProduct.display_order || 0) + 1;
      }
    }

    await onSave(currentProduct);
    await onSave(siblingProduct);
  };

  return (
    <div className="space-y-6 text-left" id="admin-products-management">
      
      {/* Header banner */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Products Catalog</h2>
          <p className="text-slate-400 text-xs mt-1">Manage catalog elements, pricing structures, and WhatsApp redirections.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-mono font-bold tracking-widest bg-[#D4AF37] text-slate-950 hover:bg-amber-500 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Catalog Item</span>
        </button>
      </div>

      {/* CRUD Form Dialog (Add / Edit) */}
      {(showAddForm || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#090d1f] border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">
                {editingProduct ? 'Edit Catalog Item' : 'Catalog New Product'}
              </h3>
              <button 
                onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
                className="p-1 rounded-lg border border-slate-850 hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={e => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Price Rate */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Price Rate (e.g. 20 Rs)</label>
                  <input
                    type="text"
                    required
                    value={formState.price}
                    onChange={e => setFormState({ ...formState, price: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Category Tag</label>
                  <select
                    value={formState.category}
                    onChange={e => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-3 text-slate-200 focus:outline-none"
                  >
                    <option value="Beverage">Beverage</option>
                    <option value="SaaS">SaaS Platform</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Services">Services</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Owner WhatsApp */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Owner WhatsApp Number (e.g. 919999999999)</label>
                  <input
                    type="text"
                    required
                    placeholder="Country code followed by digits"
                    value={formState.whatsapp_number}
                    onChange={e => setFormState({ ...formState, whatsapp_number: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {/* Featured Toggle */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase">Featured Spotlight</label>
                  <div className="flex items-center h-[42px] px-4 rounded-xl bg-slate-950 border border-slate-850">
                    <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                      <input
                        type="checkbox"
                        checked={formState.is_featured}
                        onChange={e => setFormState({ ...formState, is_featured: e.target.checked })}
                        className="rounded border-slate-800 text-[#D4AF37] focus:ring-0 focus:ring-offset-0 accent-[#D4AF37] w-4 h-4 cursor-pointer"
                      />
                      <span>Pin as Featured Product</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Brochure URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase">Brochure Document URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formState.brochure_url}
                  onChange={e => setFormState({ ...formState, brochure_url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Product Image URL */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono text-slate-505 uppercase font-bold block">Catalog Image URL</label>
                <ImageUploader
                  value={formState.image_url}
                  onChange={url => setFormState(prev => ({ ...prev, image_url: url }))}
                  bucketName="product-images"
                  rounded={false}
                />
              </div>

              {/* Product Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">Short Overview Description</label>
                  <textarea
                    rows={2}
                    value={formState.description}
                    onChange={e => setFormState({ ...formState, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-505 uppercase">Full Technical Description</label>
                  <textarea
                    rows={2}
                    value={formState.full_description}
                    onChange={e => setFormState({ ...formState, full_description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Display Order and Active Toggle */}
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
                  <label htmlFor="is_active" className="text-[10px] font-mono text-slate-400 uppercase cursor-pointer selection:bg-transparent">Active Listing</label>
                </div>
              </div>

              {/* Dynamic Feature List */}
              <div className="border border-slate-850 px-4 py-3.5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Product Highlights / Features</span>
                {formState.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {formState.features.map((feat, idx) => (
                      <div key={idx} className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-900 text-[10px] flex items-center gap-1.5 text-slate-300">
                        <span>{feat}</span>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Highlight Bullet (e.g. 100% Organic)"
                    value={newFeature}
                    onChange={e => setNewFeature(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] flex-grow text-slate-200 focus:outline-none"
                  />
                  <button type="button" onClick={addFeature} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded-xl text-slate-200 cursor-pointer">
                    Add Highlight
                  </button>
                </div>
              </div>

              {/* Dynamic Specs List */}
              <div className="border border-slate-850 px-4 py-3.5 rounded-2xl space-y-2">
                <span className="text-[10px] font-mono text-slate-400 block uppercase">Technical specifications</span>
                {Object.keys(formState.specs).length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pb-2">
                    {Object.entries(formState.specs).map(([k, val]) => (
                      <div key={k} className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-900 text-[10px] flex items-center gap-1.5 text-slate-300">
                        <span>{k}: {val}</span>
                        <button type="button" onClick={() => removeSpec(k)} className="text-red-400 hover:text-red-300 text-xs cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Metric Key (e.g. Source)"
                    value={newSpecKey}
                    onChange={e => setNewSpecKey(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] flex-grow text-slate-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Metric Value (e.g. Mountain Spring)"
                    value={newSpecVal}
                    onChange={e => setNewSpecVal(e.target.value)}
                    className="bg-slate-950 border border-slate-850 rounded-xl px-3 py-1.5 text-[10px] flex-grow text-slate-200 focus:outline-none"
                  />
                  <button type="button" onClick={addSpec} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] rounded-xl text-slate-200 cursor-pointer">
                    Add Spec
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-950/20 border border-red-900/35 text-red-400 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Buttons */}
              <div className="flex justify-end gap-3.5 pt-3.5 border-t border-slate-800/60">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
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
                  <span>{editingProduct ? 'Save Product' : 'Publish Asset'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog items list grid */}
      <div className="bg-[#090d1f]/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 font-mono tracking-wider text-slate-505 uppercase">
                <th className="p-4">Visual asset</th>
                <th className="p-4">Name / ID</th>
                <th className="p-4">Price Rate</th>
                <th className="p-4">WhatsApp Routing</th>
                <th className="p-4">Order / Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 font-sans text-slate-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-mono text-xs">
                    No products cataloged in listings yet.
                  </td>
                </tr>
              ) : (
                (() => {
                  const sortedProducts = [...products].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
                  return sortedProducts.map((product, index) => (
                    <tr key={product.id} className="hover:bg-slate-800/10">
                      <td className="p-4">
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-16 h-10 object-cover rounded-xl border border-slate-850 bg-slate-950" 
                        />
                      </td>
                      <td className="p-4 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{product.name}</span>
                          {product.is_featured && (
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[#D4AF37] text-[8px] font-mono font-bold uppercase tracking-wider">
                              <Sparkles className="w-2.5 h-2.5" />
                              <span>Featured</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-550 mt-1">
                          Category: <span className="font-mono text-slate-400">{product.category}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-[#D4AF37] text-sm">
                        {product.price}
                      </td>
                      <td className="p-4 font-mono text-slate-400">
                        +{product.whatsapp_number || '919999999999'}
                      </td>
                      <td className="p-4 font-mono">
                        <div className="text-slate-400">Order: {product.display_order || 0}</div>
                        <div className="mt-1">
                          {product.is_active !== false ? (
                            <span className="inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 uppercase tracking-wider">Active</span>
                          ) : (
                            <span className="inline-flex px-1.5 py-0.5 text-[9px] font-bold rounded bg-slate-500/10 border border-slate-800 text-slate-505 uppercase tracking-wider">Inactive</span>
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
                            disabled={index === sortedProducts.length - 1}
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-[#D4AF37] hover:bg-slate-800/40 transition-colors cursor-pointer disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(product)}
                            className="p-2 rounded-xl border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800/40 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => { if (window.confirm(`Delete ${product.name}?`)) onDelete(product.id); }}
                            className="p-2 rounded-xl border border-slate-800 text-slate-450 hover:text-red-400 hover:border-red-950 hover:bg-red-950/20 transition-colors cursor-pointer"
                            title="Delete Product"
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
