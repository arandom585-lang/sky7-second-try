import { HomeContent, AboutContent, Branch, Product, Review, Founder, ContactSubmission, SuccessStory, ContactInfoData, WebsiteSettings, TeamMember, MediaLibraryItem, ContactDetails } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export { supabase, isSupabaseConfigured };

export let isSandboxMode = typeof window !== 'undefined' && window.localStorage?.getItem('sky7_sandbox_mode') === 'true';

export function setSandboxMode(val: boolean) {
  isSandboxMode = val;
  if (typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('sky7_sandbox_mode', String(val));
  }
}



// ===================================
// DEFAULT DATA FOR LOCAL STORAGE MODE
// ===================================

const DEFAULT_HOME_CONTENT: HomeContent = {
  id: 'home-default',
  hero_title: 'Building the Future of Digital Connected Ecosystems',
  hero_subtitle: 'A unified operational technology system for modern multi-sector industries.',
  hero_description: 'We integrate advanced machine intelligence, eco-friendly physical design, and secure distributed protocols. Our platform powers enterprise branches and products worldwide with zero performance compromises.',
  partner_button_text: 'Become a Partner',
  explore_button_text: 'Explore Opportunities',
};

const DEFAULT_ABOUT_CONTENT: AboutContent = {
  id: 'about-default',
  about_title: 'Innovating at Global Scale',
  about_description: 'Founded with the mission to bridge heavy industry with quantum-safe automation, our firm leads enterprise infrastructure evolution. We deploy highly resilient software layers, hardware modules, and strategic partnerships to secure operations on six continents.',
  ecosystem_title: 'Dividends of a Connected Network',
  ecosystem_description: 'The Unified Ecosystem operates continuously from data harvesting up to high-executive decision engines. By joining our connected platform, regional branches operate with local speed while benefiting from collective network learning and shared market resources.',
  opportunities_title: 'Ecosystem Venture Initiatives',
  opportunities_description: 'We actively co-develop projects spanning high-performance IoT grids, grid-level thermal management systems, and smart industrial complexes. Partners gain direct APIs to our pre-built software stack, physical testing yards, and immediate co-marketing programs.',
};

const DEFAULT_BRANCHES: Branch[] = [
  {
    id: 'b1',
    name: 'European R&D Centre',
    location: 'Munich, Germany',
    description: 'Focused on automation systems engineering, cyber-physical stress testing, and European network distribution. Houses our specialized climate-simulation chambers.',
    image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800',
    phone: '+49 89 2389 440',
    email: 'munich.hub@corporate-eco.com',
    address: '88 Karlstrasse, 80335 Munich',
  },
  {
    id: 'b2',
    name: 'Silicon Valley Innovation Hub',
    location: 'Cupertino, California, USA',
    description: 'Our primary software engineering node specializing in decentralized database routing, user interface accessibility, and AI model coordination.',
    image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
    phone: '+1 (408) 555-0192',
    email: 'siliconvalley@corporate-eco.com',
    address: '10200 Infinite Loop, Cupertino, CA 95014',
  },
  {
    id: 'b3',
    name: 'Asian Logistics & IoT Terminal',
    location: 'Koto City, Tokyo, Japan',
    description: 'Specializes in hardware manufacturing optimization, low-latency drone delivery routing layers, and edge sensor manufacturing validations.',
    image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800',
    phone: '+81 3-5500-1111',
    email: 'tokyo.iot@corporate-eco.com',
    address: '3-1-1 Ariake, Koto City, Tokyo 135-0063',
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Sky Seven Premium Water',
    description: 'Pure, refreshing, premium drinking water sourced and bottled to the highest standards. Experience ultimate hydration with a clean, crisp taste.',
    image_url: '/images/sky_seven_water.jpg',
    price: '20 Rs',
    partner_link: '/contact?subject=Product_Sky_Seven_Water',
    category: 'Beverage',
    features: ['100% Pure & Filtered', 'Premium Quality Standards', 'Clean & Refreshing Taste'],
    specs: { Capacity: '500 ml / 1 L', Source: 'Natural Springs', Filtration: 'Multi-stage Reverse Osmosis' },
  },
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'r1',
    author: 'Elena Rostova',
    role: 'VP of Operations',
    company: 'Siberia Logistics Corp',
    rating: 5,
    text: 'Switching to the Aether-Mesh router reduced our telemetry dropouts in remote arctic regions by 96%. It operates flawlessly in extreme sub-zero conditions and deployment took less than a day.',
    date: '2026-05-12',
    verified: true,
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800',
  },
  {
    id: 'r2',
    author: 'Marcus Vance',
    role: 'Director of Security Systems',
    company: 'Apex Infrastructure Group',
    rating: 5,
    text: 'Sentry-OS has completely solved our compliance audit tracking. Knowing that our custom process loops are verified by deterministic hardware limits gives us exceptional confidence.',
    date: '2026-06-02',
    verified: true,
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800',
  },
];

const DEFAULT_FOUNDERS: Founder[] = [
  {
    id: 'f1',
    name: 'Mr. Sudhakar',
    role: 'Managing Director — SKY7',
    bio: 'Mr. Sudhakar is a business leader focused on creating real opportunities and structured growth systems. He is passionate about empowering individuals and building a community of entrepreneurs to grow, earn, and achieve their dreams.',
    image_url: '/images/founder_sudhakar.jpg',
    linkedin_url: '',
    achievement_count: '100+',
    achievement_text: 'Successful Entrepreneurs Worldwide',
  },
];

const DEFAULT_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 't1',
    name: 'Mr. Sudhakar',
    role: 'Managing Director — SKY7',
    bio: 'Mr. Sudhakar is a business leader focused on creating real opportunities and structured growth systems. He is passionate about empowering individuals and building a community of entrepreneurs to grow, earn, and achieve their dreams.',
    image_url: '/images/founder_sudhakar.jpg',
    linkedin_url: 'https://linkedin.com',
    display_order: 1,
    is_founder: true,
    is_cofounder: false,
    is_leadership: false,
  },
  {
    id: 't2',
    name: 'Sarah Jenkins',
    role: 'Co-Founder & Chief Operations',
    bio: 'Sarah oversees the expansion of our distributed branch networks and logistics optimization programs across six regions.',
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600',
    linkedin_url: 'https://linkedin.com',
    display_order: 2,
    is_founder: false,
    is_cofounder: true,
    is_leadership: false,
  },
  {
    id: 't3',
    name: 'Alex Chen',
    role: 'Lead Systems Architect',
    department: 'Technology',
    email: 'alex.chen@sky7.com',
    image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    social_links: { linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
    display_order: 3,
    is_founder: false,
    is_cofounder: false,
    is_leadership: true,
  },
  {
    id: 't4',
    name: 'Emily Davis',
    role: 'Head of Product Experience',
    department: 'Design',
    email: 'emily.davis@sky7.com',
    image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    social_links: { linkedin: 'https://linkedin.com' },
    display_order: 4,
    is_founder: false,
    is_cofounder: false,
    is_leadership: true,
  }
];

const DEFAULT_SUCCESS_STORIES: SuccessStory[] = [
  {
    id: 's1',
    name: 'Kenji Takahashi',
    achievement: 'Franchise Owner',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    stars: 5,
  },
  {
    id: 's2',
    name: 'Amanda Seyfried',
    achievement: 'MacBook Achiever',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    stars: 5,
  },
  {
    id: 's3',
    name: 'David Beckham',
    achievement: 'Pool Achiever',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    stars: 5,
  },
  {
    id: 's4',
    name: 'Emily Watson',
    achievement: 'Elite Achiever',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    stars: 5,
  },
  {
    id: 's5',
    name: 'Chris Evans',
    achievement: 'Franchise Owner',
    image: 'https://images.unsplash.com/photo-1500048993953-d23a436266cf?q=80&w=200',
    stars: 5,
  },
  {
    id: 's6',
    name: 'Natalie Portman',
    achievement: 'MacBook Achiever',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    stars: 5,
  },
];

const DEFAULT_CONTACTS: ContactInfoData = {
  id: 'contact-default',
  email: 'info@sky7.com',
  phone: '+91 XXXXX XXXXX',
  whatsapp_number: '919999999999',
  address: 'Tamil Nadu, India',
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com',
};

const DEFAULT_SETTINGS: WebsiteSettings = {
  id: 'settings-default',
  company_name: 'SKY SEVEN',
  logo_url: '/images/sky7_logo_premium.jpg',
  favicon_url: '',
  theme_primary: '#0B1B3D',
  theme_secondary: '#C5A043',
  meta_title: 'SKY SEVEN - Corporate Ecosystem',
  meta_description: 'Building the Future of Digital Connected Ecosystems',
};

const DEFAULT_CONTACT_DETAILS: ContactDetails = {
  id: 'contact-details-default',
  company_name: 'SKY SEVEN',
  phone: '+91 XXXXX XXXXX',
  whatsapp: '919999999999',
  email: 'info@sky7.com',
  address: 'Tamil Nadu, India',
  google_maps_url: 'https://maps.google.com/?q=Tamil+Nadu,+India',
  website_url: 'https://sky7.com',
  facebook_url: 'https://facebook.com/sky7',
  instagram_url: 'https://instagram.com/sky7',
  linkedin_url: 'https://linkedin.com/company/sky7',
  youtube_url: 'https://youtube.com/sky7',
  business_hours: 'Mon - Sat: 9:00 AM - 6:00 PM'
};

// LocalStorage helpers to simulate database operations tables
const getStorageItem = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
};

const setStorageItem = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

const withTimeout = async <T>(promise: Promise<T>, label: string, ms = 10000): Promise<T> => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      })
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

const STORAGE_BUCKETS = ['founders-images', 'branch-images', 'product-images', 'gallery-images'] as const;

const getStorageErrorMessage = (err: any, fallback: string): string => {
  const message = err?.message || err?.error_description || err?.error || fallback;
  const status = err?.statusCode || err?.status;
  return status ? `${message} (status ${status})` : message;
};

const createStoragePath = (file: File): string => {
  const rawExt = file.name.split('.').pop() || 'jpg';
  const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const baseName = file.name
    .replace(/\.[^/.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'image';
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${yyyy}/${mm}/${baseName}-${unique}.${fileExt}`;
};

// ===================================
// PUBLIC UNIFIED DATABASE API
// ===================================

export const db = {
  // 1. Home Content
  async getHomeContent(): Promise<HomeContent> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!.from('home_content').select('*').maybeSingle(),
          'home_content fetch'
        );
        if (error || !data) {
          console.warn('Supabase home_content returned no usable row:', error || 'empty result');
          return DEFAULT_HOME_CONTENT;
        }
        return data;
      } catch (err) {
        console.warn('Supabase fetch home_content failed:', err);
        return DEFAULT_HOME_CONTENT;
      }
    }
    return getStorageItem<HomeContent>('home_content', DEFAULT_HOME_CONTENT);
  },

  async saveHomeContent(content: HomeContent): Promise<HomeContent> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('home_content').upsert({
          ...content,
          id: 'home-default',
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save home_content failed:', err);
        throw err;
      }
    }
    setStorageItem('home_content', content);
    return content;
  },

  // 2. About Content
  async getAboutContent(): Promise<AboutContent> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!.from('about_content').select('*').maybeSingle(),
          'about_content fetch'
        );
        if (error || !data) {
          console.warn('Supabase about_content returned no usable row:', error || 'empty result');
          return DEFAULT_ABOUT_CONTENT;
        }
        return data;
      } catch (err) {
        console.warn('Supabase fetch about_content failed:', err);
        return DEFAULT_ABOUT_CONTENT;
      }
    }
    return getStorageItem<AboutContent>('about_content', DEFAULT_ABOUT_CONTENT);
  },

  async saveAboutContent(content: AboutContent): Promise<AboutContent> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('about_content').upsert({
          ...content,
          id: 'about-default',
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save about_content failed:', err);
        throw err;
      }
    }
    setStorageItem('about_content', content);
    return content;
  },

  // 3. Branches
  async getBranches(activeOnly: boolean = false): Promise<Branch[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        let query = supabase!.from('branches').select('*');
        if (activeOnly) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await withTimeout(
          query.order('display_order', { ascending: true }),
          'branches fetch'
        );
        if (error) {
          console.warn('Supabase branches query failed:', error);
          return DEFAULT_BRANCHES;
        }
        if (!data || data.length === 0) return DEFAULT_BRANCHES;
        return data.map((item: any) => ({
          id: item.id,
          name: item.branch_name,
          location: item.map_link || '',
          city: item.city,
          state: item.state || '',
          address: item.address || '',
          phone: item.phone || '',
          email: item.email || '',
          image_url: item.image_url || '',
          description: item.description || '',
          display_order: item.display_order,
          is_active: item.is_active,
          created_at: item.created_at
        }));
      } catch (err) {
        console.warn('Supabase fetch branches failed:', err);
        return DEFAULT_BRANCHES;
      }
    }
    const local = getStorageItem<Branch[]>('branches', DEFAULT_BRANCHES);
    return activeOnly ? local.filter(b => b.is_active !== false) : local;
  },

  async saveBranch(branch: Branch): Promise<Branch> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          branch_name: branch.name,
          city: branch.city || branch.address?.split(',')[0]?.trim() || 'Unknown',
          state: branch.state || branch.address?.split(',')[1]?.trim() || null,
          address: branch.address || null,
          phone: branch.phone || null,
          email: branch.email || null,
          map_link: branch.location || null,
          image_url: branch.image_url || null,
          description: branch.description || null,
          display_order: branch.display_order || 0,
          is_active: branch.is_active !== undefined ? branch.is_active : true,
          updated_at: new Date().toISOString()
        };

        if (branch.id && !branch.id.startsWith('b-')) {
          dbPayload.id = branch.id;
        }

        const { data, error } = await supabase!
          .from('branches')
          .upsert(dbPayload)
          .select()
          .single();
        if (error) throw error;
        return {
          id: data.id,
          name: data.branch_name,
          location: data.map_link || '',
          city: data.city,
          state: data.state || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          image_url: data.image_url || '',
          description: data.description || '',
          display_order: data.display_order,
          is_active: data.is_active,
          created_at: data.created_at
        };
      } catch (err) {
        console.error('Supabase save branch failed:', err);
        throw err;
      }
    }
    const branches = getStorageItem<Branch[]>('branches', DEFAULT_BRANCHES);
    const index = branches.findIndex((b) => b.id === branch.id);
    if (index >= 0) {
      branches[index] = branch;
    } else {
      branch.id = branch.id || 'b-' + Date.now();
      branches.push(branch);
    }
    setStorageItem('branches', branches);
    return branch;
  },

  async deleteBranch(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data: item } = await supabase!
          .from('branches')
          .select('image_url')
          .eq('id', id)
          .single();

        const { error } = await supabase!.from('branches').delete().eq('id', id);
        if (error) throw error;

        if (item?.image_url) {
          await db.deleteMedia(item.image_url, 'branch-images');
        }
        return true;
      } catch (err) {
        console.error('Supabase delete branch failed:', err);
        throw err;
      }
    }
    const branches = getStorageItem<Branch[]>('branches', DEFAULT_BRANCHES);
    const filtered = branches.filter((b) => b.id !== id);
    setStorageItem('branches', filtered);
    return true;
  },

  // 4. Products
  async getProducts(activeOnly: boolean = false): Promise<Product[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        let query = supabase!.from('products').select('*');
        if (activeOnly) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await withTimeout(
          query
            .order('is_featured', { ascending: false })
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false }),
          'products fetch'
        );
        if (error) {
          console.warn('Supabase products query failed:', error);
          return DEFAULT_PRODUCTS;
        }
        if (!data || data.length === 0) return DEFAULT_PRODUCTS;
        return data.map((item: any) => {
          const gallery = item.gallery_images || {};
          return {
            id: item.id,
            name: item.product_name,
            description: item.short_description || '',
            image_url: item.image_url || '',
            price: gallery.price || '',
            partner_link: gallery.partner_link || '',
            category: item.category || '',
            features: gallery.features || [],
            specs: gallery.specs || {},
            whatsapp_number: gallery.whatsapp_number || '',
            is_featured: item.is_featured,
            is_active: item.is_active,
            display_order: item.display_order,
            full_description: item.full_description || '',
            brochure_url: item.brochure_url || '',
            created_at: item.created_at,
            updated_at: item.updated_at
          };
        });
      } catch (err) {
        console.warn('Supabase fetch products failed:', err);
        return DEFAULT_PRODUCTS;
      }
    }
    const local = getStorageItem<Product[]>('products', DEFAULT_PRODUCTS);
    const sorted = [...local].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (a.display_order || 0) - (b.display_order || 0);
    });
    return activeOnly ? sorted.filter(p => p.is_active !== false) : sorted;
  },

  async saveProduct(product: Product): Promise<Product> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const galleryPayload = {
          price: product.price || '',
          partner_link: product.partner_link || '',
          features: product.features || [],
          specs: product.specs || {},
          whatsapp_number: product.whatsapp_number || ''
        };

        const dbPayload: any = {
          product_name: product.name,
          category: product.category || null,
          short_description: product.description || null,
          full_description: product.full_description || null,
          image_url: product.image_url || null,
          gallery_images: galleryPayload,
          brochure_url: product.brochure_url || null,
          display_order: product.display_order || 0,
          is_featured: !!product.is_featured,
          is_active: product.is_active !== undefined ? product.is_active : true,
          updated_at: new Date().toISOString()
        };

        if (product.id && !product.id.startsWith('p-')) {
          dbPayload.id = product.id;
        }

        const { data, error } = await supabase!
          .from('products')
          .upsert(dbPayload)
          .select()
          .single();
        if (error) throw error;
        const gallery = data.gallery_images || {};
        return {
          id: data.id,
          name: data.product_name,
          description: data.short_description || '',
          image_url: data.image_url || '',
          price: gallery.price || '',
          partner_link: gallery.partner_link || '',
          category: data.category || '',
          features: gallery.features || [],
          specs: gallery.specs || {},
          whatsapp_number: gallery.whatsapp_number || '',
          is_featured: data.is_featured,
          is_active: data.is_active,
          display_order: data.display_order,
          full_description: data.full_description || '',
          brochure_url: data.brochure_url || '',
          created_at: data.created_at,
          updated_at: data.updated_at
        };
      } catch (err) {
        console.error('Supabase save product failed:', err);
        throw err;
      }
    }
    const products = getStorageItem<Product[]>('products', DEFAULT_PRODUCTS);
    const index = products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      product.id = product.id || 'p-' + Date.now();
      products.push(product);
    }
    setStorageItem('products', products);
    return product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data: item } = await supabase!
          .from('products')
          .select('image_url')
          .eq('id', id)
          .single();

        const { error } = await supabase!.from('products').delete().eq('id', id);
        if (error) throw error;

        if (item?.image_url) {
          await db.deleteMedia(item.image_url, 'product-images');
        }
        return true;
      } catch (err) {
        console.error('Supabase delete product failed:', err);
        throw err;
      }
    }
    const products = getStorageItem<Product[]>('products', DEFAULT_PRODUCTS);
    const filtered = products.filter((p) => p.id !== id);
    setStorageItem('products', filtered);
    return true;
  },

  // 5. Reviews
  async getReviews(activeOnly: boolean = false): Promise<Review[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        let query = supabase!.from('testimonials').select('*');
        if (activeOnly) {
          query = query.eq('is_active', true);
        }
        const { data, error } = await withTimeout(
          query
            .order('is_featured', { ascending: false })
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false }),
          'testimonials fetch'
        );
        if (error) {
          console.warn('Supabase testimonials query failed:', error);
          return DEFAULT_REVIEWS;
        }
        if (!data || data.length === 0) return DEFAULT_REVIEWS;
        return data.map((item: any) => ({
          id: item.id,
          author: item.client_name,
          role: item.designation || '',
          company: item.company_name || '',
          rating: item.rating,
          text: item.testimonial,
          verified: true, // testimonials are verified by default
          date: item.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          image_url: item.profile_image_url || '',
          display_order: item.display_order,
          is_featured: item.is_featured,
          is_active: item.is_active,
          created_at: item.created_at,
          updated_at: item.updated_at
        }));
      } catch (err) {
        console.warn('Supabase fetch testimonials failed:', err);
        return DEFAULT_REVIEWS;
      }
    }
    const local = getStorageItem<Review[]>('reviews', DEFAULT_REVIEWS);
    const sorted = [...local].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return (a.display_order || 0) - (b.display_order || 0);
    });
    return activeOnly ? sorted.filter(r => r.is_active !== false) : sorted;
  },

  async saveReview(review: Review): Promise<Review> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          client_name: review.author,
          company_name: review.company || null,
          designation: review.role || null,
          testimonial: review.text,
          profile_image_url: review.image_url || null,
          rating: review.rating !== undefined ? review.rating : 5,
          display_order: review.display_order || 0,
          is_featured: !!review.is_featured,
          is_active: review.is_active !== undefined ? review.is_active : true,
          updated_at: new Date().toISOString()
        };

        if (review.id && !review.id.startsWith('t-') && !review.id.startsWith('r-')) {
          dbPayload.id = review.id;
        }

        const { data, error } = await supabase!
          .from('testimonials')
          .upsert(dbPayload)
          .select()
          .single();
        if (error) throw error;
        return {
          id: data.id,
          author: data.client_name,
          role: data.designation || '',
          company: data.company_name || '',
          rating: data.rating,
          text: data.testimonial,
          verified: true,
          date: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
          image_url: data.profile_image_url || '',
          display_order: data.display_order,
          is_featured: data.is_featured,
          is_active: data.is_active,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
      } catch (err) {
        console.error('Supabase save testimonial failed:', err);
        throw err;
      }
    }
    const reviews = getStorageItem<Review[]>('reviews', DEFAULT_REVIEWS);
    const index = reviews.findIndex((r) => r.id === review.id);
    if (index >= 0) {
      reviews[index] = review;
    } else {
      review.id = review.id || 'r-' + Date.now();
      reviews.push(review);
    }
    setStorageItem('reviews', reviews);
    return review;
  },

  async deleteReview(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data: item } = await supabase!
          .from('testimonials')
          .select('image_url')
          .eq('id', id)
          .single();

        const { error } = await supabase!.from('testimonials').delete().eq('id', id);
        if (error) throw error;

        if (item?.image_url) {
          await db.deleteMedia(item.image_url, 'founders-images');
        }
        return true;
      } catch (err) {
        console.error('Supabase delete testimonial failed:', err);
        throw err;
      }
    }
    const reviews = getStorageItem<Review[]>('reviews', DEFAULT_REVIEWS);
    const filtered = reviews.filter((r) => r.id !== id);
    setStorageItem('reviews', filtered);
    return true;
  },

  // 6. Founders
  async getFounders(): Promise<Founder[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!
            .from('founders_team')
            .select('*')
            .eq('is_founder', true)
            .order('display_order', { ascending: true }),
          'founders fetch'
        );
        if (error) {
          console.warn('Supabase founders query failed:', error);
          return DEFAULT_FOUNDERS;
        }
        if (!data || data.length === 0) return DEFAULT_FOUNDERS;
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          bio: item.bio || '',
          image_url: item.image_url,
          linkedin_url: item.linkedin_url || '',
          achievement_count: '100+',
          achievement_text: 'Successful Entrepreneurs Worldwide',
          created_at: item.created_at
        }));
      } catch (err) {
        console.warn('Supabase fetch founders failed:', err);
        return DEFAULT_FOUNDERS;
      }
    }
    return getStorageItem<Founder[]>('founders', DEFAULT_FOUNDERS);
  },

  async saveFounder(founder: Founder): Promise<Founder> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          name: founder.name,
          role: founder.role,
          bio: founder.bio,
          image_url: founder.image_url,
          linkedin_url: founder.linkedin_url,
          is_founder: true,
          is_cofounder: false,
          is_leadership: false,
          updated_at: new Date().toISOString()
        };

        if (founder.id && !founder.id.startsWith('f-')) {
          dbPayload.id = founder.id;
        }

        const { data, error } = await supabase!.from('founders_team').upsert(dbPayload).select().single();
        if (error) throw error;
        return {
          id: data.id,
          name: data.name,
          role: data.role,
          bio: data.bio || '',
          image_url: data.image_url,
          linkedin_url: data.linkedin_url || '',
          achievement_count: '100+',
          achievement_text: 'Successful Entrepreneurs Worldwide',
          created_at: data.created_at
        };
      } catch (err) {
        console.error('Supabase save founder failed:', err);
        throw err;
      }
    }
    const founders = getStorageItem<Founder[]>('founders', DEFAULT_FOUNDERS);
    const index = founders.findIndex((f) => f.id === founder.id);
    if (index >= 0) {
      founders[index] = founder;
    } else {
      founder.id = founder.id || 'f-' + Date.now();
      founders.push(founder);
    }
    setStorageItem('founders', founders);
    return founder;
  },

  async deleteFounder(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('founders_team').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete founder failed:', err);
        throw err;
      }
    }
    const founders = getStorageItem<Founder[]>('founders', DEFAULT_FOUNDERS);
    const filtered = founders.filter((f) => f.id !== id);
    setStorageItem('founders', filtered);
    return true;
  },

  // 7. Contact Submissions
  async getSubmissions(): Promise<ContactSubmission[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contact_submissions').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase fetch submissions failed:', err);
        throw err;
      }
    }
    return getStorageItem<ContactSubmission[]>('contact_submissions', []);
  },

  async addSubmission(submission: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<ContactSubmission> {
    const fullSubmission: ContactSubmission = {
      ...submission,
      id: 'sub-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contact_submissions').insert(fullSubmission).select().single();
        if (error) throw error;
        if (data) return data;
      } catch (err) {
        console.error('Supabase save submission failed:', err);
        throw err;
      }
    }
    const list = getStorageItem<ContactSubmission[]>('contact_submissions', []);
    list.unshift(fullSubmission);
    setStorageItem('contact_submissions', list);
    return fullSubmission;
  },

  async deleteSubmission(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('contact_submissions').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete submission failed:', err);
        throw err;
      }
    }
    const submissions = getStorageItem<ContactSubmission[]>('contact_submissions', []);
    const filtered = submissions.filter((s) => s.id !== id);
    setStorageItem('contact_submissions', filtered);
    return true;
  },

  // 8. Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!.from('success_stories').select('*').order('created_at', { ascending: true }),
          'success stories fetch'
        );
        if (error) {
          console.warn('Supabase success_stories query failed:', error);
          return DEFAULT_SUCCESS_STORIES;
        }
        if (!data || data.length === 0) return DEFAULT_SUCCESS_STORIES;
        return data;
      } catch (err) {
        console.warn('Supabase fetch success_stories failed:', err);
        return DEFAULT_SUCCESS_STORIES;
      }
    }
    return getStorageItem<SuccessStory[]>('success_stories', DEFAULT_SUCCESS_STORIES);
  },

  async saveSuccessStory(story: SuccessStory): Promise<SuccessStory> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('success_stories').upsert(story).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save success_story failed:', err);
        throw err;
      }
    }
    const stories = getStorageItem<SuccessStory[]>('success_stories', DEFAULT_SUCCESS_STORIES);
    const index = stories.findIndex((s) => s.id === story.id);
    if (index >= 0) {
      stories[index] = story;
    } else {
      story.id = story.id || 's-' + Date.now();
      stories.push(story);
    }
    setStorageItem('success_stories', stories);
    return story;
  },

  async deleteSuccessStory(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data: item } = await supabase!
          .from('success_stories')
          .select('image')
          .eq('id', id)
          .single();

        const { error } = await supabase!.from('success_stories').delete().eq('id', id);
        if (error) throw error;

        if (item?.image) {
          await db.deleteMedia(item.image, 'gallery-images');
        }
        return true;
      } catch (err) {
        console.error('Supabase delete success_story failed:', err);
        throw err;
      }
    }
    const stories = getStorageItem<SuccessStory[]>('success_stories', DEFAULT_SUCCESS_STORIES);
    const filtered = stories.filter((s) => s.id !== id);
    setStorageItem('success_stories', filtered);
    return true;
  },

  // 9. Contacts
  async getContacts(): Promise<ContactInfoData> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!.from('contacts').select('*').maybeSingle(),
          'contacts fetch'
        );
        if (error || !data) return DEFAULT_CONTACTS;
        return data;
      } catch (err) {
        console.warn('Supabase fetch contacts failed:', err);
        return DEFAULT_CONTACTS;
      }
    }
    return getStorageItem<ContactInfoData>('contacts', DEFAULT_CONTACTS);
  },

  async saveContacts(contacts: ContactInfoData): Promise<ContactInfoData> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contacts').upsert({
          ...contacts,
          id: 'contact-default',
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save contacts failed:', err);
        throw err;
      }
    }
    setStorageItem('contacts', contacts);
    return contacts;
  },

  async getSettings(): Promise<WebsiteSettings> {
    let settingsData: WebsiteSettings;
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!.from('website_settings').select('*').maybeSingle(),
          'website_settings fetch'
        );
        settingsData = !error && data ? data : DEFAULT_SETTINGS;
      } catch (err) {
        console.warn('Supabase fetch website_settings failed:', err);
        settingsData = DEFAULT_SETTINGS;
      }
    } else {
      settingsData = getStorageItem<WebsiteSettings>('settings', DEFAULT_SETTINGS);
    }

    // Auto-migrate old/empty values in local storage to use the new logo and theme
    if (!settingsData.logo_url || settingsData.logo_url === '' || settingsData.theme_primary === '#173B8C') {
      settingsData.logo_url = DEFAULT_SETTINGS.logo_url;
      settingsData.theme_primary = DEFAULT_SETTINGS.theme_primary;
      settingsData.theme_secondary = DEFAULT_SETTINGS.theme_secondary;
      if (isSandboxMode || !isSupabaseConfigured) {
        setStorageItem('settings', settingsData);
      }
    }
    return settingsData;
  },

  async saveSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('website_settings').upsert({
          ...settings,
          id: 'settings-default',
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save website_settings failed:', err);
        throw err;
      }
    }
    setStorageItem('settings', settings);
    return settings;
  },

  // Media / File upload to buckets helper
  async uploadMedia(file: File, bucketName: string): Promise<string> {
    if (!STORAGE_BUCKETS.includes(bucketName as any)) {
      throw new Error(`Invalid storage bucket "${bucketName}".`);
    }

    if (!isSandboxMode && isSupabaseConfigured) {
      const filePath = createStoragePath(file);
      try {
        const { data: uploadData, error: uploadError } = await supabase!.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            contentType: file.type || undefined,
            upsert: false
          });

        if (uploadError) {
          console.error('[storage.uploadMedia] Supabase upload failed', {
            bucketName,
            filePath,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            error: uploadError
          });
          throw new Error(getStorageErrorMessage(uploadError, 'Storage upload failed.'));
        }

        const { data } = supabase!.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (!data?.publicUrl) {
          console.error('[storage.uploadMedia] Public URL generation returned no URL', {
            bucketName,
            filePath,
            uploadData
          });
          throw new Error('Upload completed, but Supabase did not return a public URL.');
        }

        return data.publicUrl;
      } catch (err) {
        console.error('[storage.uploadMedia] Media upload error', {
          bucketName,
          filePath,
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          error: err
        });
        throw err;
      }
    }

    // Fallback: Convert to ObjectURL or Base64 for the mockup preview session
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  },

  // 10. Team Members
  async getTeamMembers(): Promise<TeamMember[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!
            .from('founders_team')
            .select('*')
            .order('display_order', { ascending: true }),
          'team members fetch'
        );
        if (error) {
          console.warn('Supabase team_members query failed:', error);
          return DEFAULT_TEAM_MEMBERS;
        }
        if (!data || data.length === 0) return DEFAULT_TEAM_MEMBERS;
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          bio: item.bio || undefined,
          image_url: item.image_url,
          linkedin_url: item.linkedin_url || undefined,
          email: item.email || undefined,
          department: item.department || undefined,
          social_links: item.social_links || {},
          display_order: item.display_order,
          is_founder: item.is_founder,
          is_cofounder: item.is_cofounder,
          is_leadership: item.is_leadership,
          created_at: item.created_at,
          updated_at: item.updated_at,
          type: item.is_founder ? 'founder' : item.is_cofounder ? 'co-founder' : 'team_member'
        }));
      } catch (err) {
        console.warn('Supabase fetch team_members failed:', err);
        return DEFAULT_TEAM_MEMBERS;
      }
    }
    return getStorageItem<TeamMember[]>('team_members', DEFAULT_TEAM_MEMBERS);
  },

  async saveTeamMember(member: TeamMember): Promise<TeamMember> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          name: member.name,
          role: member.role,
          department: member.department || null,
          bio: member.bio || null,
          image_url: member.image_url,
          linkedin_url: member.linkedin_url || null,
          display_order: member.display_order,
          is_founder: member.type === 'founder',
          is_cofounder: member.type === 'co-founder',
          is_leadership: member.type === 'team_member',
          email: member.email || null,
          social_links: typeof member.social_links === 'string' 
            ? JSON.parse(member.social_links || '{}') 
            : member.social_links || {},
          updated_at: new Date().toISOString()
        };

        if (member.id && !member.id.startsWith('t-')) {
          dbPayload.id = member.id;
        }

        const { data, error } = await supabase!.from('founders_team').upsert(dbPayload).select().single();
        if (error) throw error;
        return {
          id: data.id,
          name: data.name,
          role: data.role,
          bio: data.bio || undefined,
          image_url: data.image_url,
          linkedin_url: data.linkedin_url || undefined,
          email: data.email || undefined,
          department: data.department || undefined,
          social_links: data.social_links || {},
          display_order: data.display_order,
          is_founder: data.is_founder,
          is_cofounder: data.is_cofounder,
          is_leadership: data.is_leadership,
          created_at: data.created_at,
          updated_at: data.updated_at,
          type: data.is_founder ? 'founder' : data.is_cofounder ? 'co-founder' : 'team_member'
        };
      } catch (err) {
        console.error('Supabase save team member failed:', err);
        throw err;
      }
    }
    const members = getStorageItem<TeamMember[]>('team_members', DEFAULT_TEAM_MEMBERS);
    const index = members.findIndex((m) => m.id === member.id);
    if (index >= 0) {
      members[index] = member;
    } else {
      member.id = member.id || 't-' + Date.now();
      members.push(member);
    }
    setStorageItem('team_members', members);
    return member;
  },

  async deleteTeamMember(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data: item } = await supabase!
          .from('founders_team')
          .select('image_url')
          .eq('id', id)
          .single();

        const { error } = await supabase!.from('founders_team').delete().eq('id', id);
        if (error) throw error;

        if (item?.image_url) {
          await db.deleteMedia(item.image_url, 'founders-images');
        }
        return true;
      } catch (err) {
        console.error('Supabase delete team member failed:', err);
        throw err;
      }
    }
    const members = getStorageItem<TeamMember[]>('team_members', DEFAULT_TEAM_MEMBERS);
    const filtered = members.filter((m) => m.id !== id);
    setStorageItem('team_members', filtered);
    return true;
  },

  async getMediaLibrary(): Promise<MediaLibraryItem[]> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!
            .from('media_library')
            .select('*')
            .order('display_order', { ascending: true })
            .order('uploaded_at', { ascending: false }),
          'media library fetch'
        );
        if (error) return [];
        return data || [];
      } catch (err) {
        console.warn('Supabase fetch media_library failed:', err);
        return [];
      }
    }
    // Fallback seed data
    const defaults: MediaLibraryItem[] = [
      { id: 'm-1', title: 'Founder Mr. Sudhakar', file_name: 'founder_sudhakar.jpg', file_url: '/images/founder_sudhakar.jpg', file_type: 'image/jpeg', file_size: 247808, category: 'Images', alt_text: 'SKY7 Managing Director Mr. Sudhakar', display_order: 1, is_active: true, uploaded_at: new Date().toISOString() },
      { id: 'm-2', title: 'Sky Seven Premium Water Bottling Layout', file_name: 'sky_seven_water.jpg', file_url: '/images/sky_seven_water.jpg', file_type: 'image/jpeg', file_size: 189440, category: 'Images', alt_text: 'Sky Seven Premium Water package thumbnail', display_order: 2, is_active: true, uploaded_at: new Date().toISOString() },
    ];
    return getStorageItem<MediaLibraryItem[]>('media_library', defaults);
  },

  async saveMediaItem(item: MediaLibraryItem): Promise<MediaLibraryItem> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const dbPayload: any = {
          title: item.title,
          file_name: item.file_name,
          file_url: item.file_url,
          file_type: item.file_type,
          file_size: item.file_size || null,
          category: item.category || null,
          alt_text: item.alt_text || null,
          display_order: item.display_order || 0,
          is_active: item.is_active !== undefined ? item.is_active : true,
          updated_at: new Date().toISOString()
        };

        if (item.id && !item.id.startsWith('m-')) {
          dbPayload.id = item.id;
        }

        const { data, error } = await supabase!
          .from('media_library')
          .upsert(dbPayload)
          .select()
          .single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save media item failed:', err);
        throw err;
      }
    }
    const items = getStorageItem<MediaLibraryItem[]>('media_library', []);
    const index = items.findIndex((i) => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      item.id = item.id || 'm-' + Date.now();
      items.push(item);
    }
    setStorageItem('media_library', items);
    return item;
  },

  async deleteMediaItem(id: string): Promise<boolean> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('media_library').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete media item failed:', err);
        throw err;
      }
    }
    const items = getStorageItem<MediaLibraryItem[]>('media_library', []);
    const filtered = items.filter((i) => i.id !== id);
    setStorageItem('media_library', filtered);
    return true;
  },

  async deleteMedia(url: string, bucketName: string): Promise<boolean> {
    if (!STORAGE_BUCKETS.includes(bucketName as any)) {
      throw new Error(`Invalid storage bucket "${bucketName}".`);
    }

    if (!isSandboxMode && isSupabaseConfigured && url && url.includes(bucketName)) {
      try {
        // Extract file path from public URL
        const urlParts = url.split(`/${bucketName}/`);
        if (urlParts.length > 1) {
          const filePath = decodeURIComponent(urlParts[1].split('?')[0]);
          const { error } = await supabase!.storage
            .from(bucketName)
            .remove([filePath]);
          if (error) {
            console.error('[storage.deleteMedia] Supabase delete failed', {
              bucketName,
              filePath,
              url,
              error
            });
            throw new Error(getStorageErrorMessage(error, 'Storage delete failed.'));
          }
          return true;
        }
      } catch (err) {
        console.error('[storage.deleteMedia] Media delete error', { bucketName, url, error: err });
        throw err;
      }
    }
    return true;
  },

  async getContactDetails(): Promise<ContactDetails> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await withTimeout(
          supabase!.from('contact_details').select('*').maybeSingle(),
          'contact_details fetch'
        );
        if (error || !data) return DEFAULT_CONTACT_DETAILS;
        return data;
      } catch (err) {
        console.warn('Supabase fetch contact_details failed:', err);
        return DEFAULT_CONTACT_DETAILS;
      }
    }
    return getStorageItem<ContactDetails>('contact_details', DEFAULT_CONTACT_DETAILS);
  },

  async saveContactDetails(details: ContactDetails): Promise<ContactDetails> {
    if (!isSandboxMode && isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contact_details').upsert({
          ...details,
          id: 'contact-details-default',
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save contact_details failed:', err);
        throw err;
      }
    }
    setStorageItem('contact_details', details);
    return details;
  }
};
