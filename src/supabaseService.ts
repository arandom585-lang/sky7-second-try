import { HomeContent, AboutContent, Branch, Product, Review, Founder, ContactSubmission, SuccessStory, ContactInfoData, WebsiteSettings, TeamMember } from './types';
import { supabase, isSupabaseConfigured } from './lib/supabase';

export { supabase, isSupabaseConfigured };


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

// ===================================
// PUBLIC UNIFIED DATABASE API
// ===================================

export const db = {
  // 1. Home Content
  async getHomeContent(): Promise<HomeContent> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('home_content').select('*').single();
        if (error) {
          if (error.code === 'PGRST116') {
            // No row found, let's seed or return default
            return DEFAULT_HOME_CONTENT;
          }
          throw error;
        }
        return data;
      } catch (err) {
        console.warn('Supabase fetch home_content failed, falling back to local storage', err);
      }
    }
    return getStorageItem<HomeContent>('home_content', DEFAULT_HOME_CONTENT);
  },

  async saveHomeContent(content: HomeContent): Promise<HomeContent> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('home_content').upsert({
          id: 'home-default',
          ...content,
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save home_content failed:', err);
      }
    }
    setStorageItem('home_content', content);
    return content;
  },

  // 2. About Content
  async getAboutContent(): Promise<AboutContent> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('about_content').select('*').single();
        if (error) {
          if (error.code === 'PGRST116') {
            return DEFAULT_ABOUT_CONTENT;
          }
          throw error;
        }
        return data;
      } catch (err) {
        console.warn('Supabase fetch about_content failed, falling back to local storage', err);
      }
    }
    return getStorageItem<AboutContent>('about_content', DEFAULT_ABOUT_CONTENT);
  },

  async saveAboutContent(content: AboutContent): Promise<AboutContent> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('about_content').upsert({
          id: 'about-default',
          ...content,
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save about_content failed:', err);
      }
    }
    setStorageItem('about_content', content);
    return content;
  },

  // 3. Branches
  async getBranches(): Promise<Branch[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('branches').select('*').order('name', { ascending: true });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase fetch branches failed, falling back to local storage', err);
      }
    }
    return getStorageItem<Branch[]>('branches', DEFAULT_BRANCHES);
  },

  async saveBranch(branch: Branch): Promise<Branch> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('branches').upsert(branch).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save branch failed:', err);
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
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('branches').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete branch failed:', err);
      }
    }
    const branches = getStorageItem<Branch[]>('branches', DEFAULT_BRANCHES);
    const filtered = branches.filter((b) => b.id !== id);
    setStorageItem('branches', filtered);
    return true;
  },

  // 4. Products
  async getProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('products').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase fetch products failed, falling back to local storage', err);
      }
    }
    const stored = getStorageItem<Product[]>('products', DEFAULT_PRODUCTS);
    if (stored.some(p => p.id === 'p2' || p.id === 'p3' || p.name.includes('Aether-Mesh'))) {
      setStorageItem('products', DEFAULT_PRODUCTS);
      return DEFAULT_PRODUCTS;
    }
    return stored;
  },

  async saveProduct(product: Product): Promise<Product> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('products').upsert(product).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save product failed:', err);
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
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('products').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete product failed:', err);
      }
    }
    const products = getStorageItem<Product[]>('products', DEFAULT_PRODUCTS);
    const filtered = products.filter((p) => p.id !== id);
    setStorageItem('products', filtered);
    return true;
  },

  // 5. Reviews
  async getReviews(): Promise<Review[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('reviews').select('*').order('date', { ascending: false });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase fetch reviews failed, falling back to local storage', err);
      }
    }
    return getStorageItem<Review[]>('reviews', DEFAULT_REVIEWS);
  },

  async saveReview(review: Review): Promise<Review> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('reviews').upsert(review).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save review failed:', err);
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
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('reviews').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete review failed:', err);
      }
    }
    const reviews = getStorageItem<Review[]>('reviews', DEFAULT_REVIEWS);
    const filtered = reviews.filter((r) => r.id !== id);
    setStorageItem('reviews', filtered);
    return true;
  },

  // 6. Founders
  async getFounders(): Promise<Founder[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('founders_team')
          .select('*')
          .eq('is_founder', true)
          .order('display_order', { ascending: true });
        if (error) throw error;
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
        console.warn('Supabase fetch founders failed, falling back to local storage', err);
      }
    }
    return getStorageItem<Founder[]>('founders', DEFAULT_FOUNDERS);
  },

  async saveFounder(founder: Founder): Promise<Founder> {
    if (isSupabaseConfigured) {
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
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('founders_team').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete founder failed:', err);
      }
    }
    const founders = getStorageItem<Founder[]>('founders', DEFAULT_FOUNDERS);
    const filtered = founders.filter((f) => f.id !== id);
    setStorageItem('founders', filtered);
    return true;
  },

  // 7. Contact Submissions
  async getSubmissions(): Promise<ContactSubmission[]> {
    return getStorageItem<ContactSubmission[]>('contact_submissions', []);
  },

  async addSubmission(submission: Omit<ContactSubmission, 'id' | 'created_at'>): Promise<ContactSubmission> {
    const fullSubmission: ContactSubmission = {
      ...submission,
      id: 'sub-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contact_submissions').insert(fullSubmission).select().single();
        if (!error && data) return data;
      } catch (err) {
        console.error('Supabase save submission failed, using local storage backup', err);
      }
    }
    const list = getStorageItem<ContactSubmission[]>('contact_submissions', []);
    list.unshift(fullSubmission);
    setStorageItem('contact_submissions', list);
    return fullSubmission;
  },

  async deleteSubmission(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        await supabase!.from('contact_submissions').delete().eq('id', id);
      } catch {
        // ignore
      }
    }
    const submissions = getStorageItem<ContactSubmission[]>('contact_submissions', []);
    const filtered = submissions.filter((s) => s.id !== id);
    setStorageItem('contact_submissions', filtered);
    return true;
  },

  // 8. Success Stories
  async getSuccessStories(): Promise<SuccessStory[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('success_stories').select('*').order('created_at', { ascending: true });
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase fetch success_stories failed, falling back to local storage', err);
      }
    }
    return getStorageItem<SuccessStory[]>('success_stories', DEFAULT_SUCCESS_STORIES);
  },

  async saveSuccessStory(story: SuccessStory): Promise<SuccessStory> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('success_stories').upsert(story).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save success_story failed:', err);
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
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('success_stories').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete success_story failed:', err);
      }
    }
    const stories = getStorageItem<SuccessStory[]>('success_stories', DEFAULT_SUCCESS_STORIES);
    const filtered = stories.filter((s) => s.id !== id);
    setStorageItem('success_stories', filtered);
    return true;
  },

  // 9. Contacts
  async getContacts(): Promise<ContactInfoData> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contacts').select('*').single();
        if (error) {
          if (error.code === 'PGRST116') {
            return DEFAULT_CONTACTS;
          }
          throw error;
        }
        return data;
      } catch (err) {
        console.warn('Supabase fetch contacts failed, falling back to local storage', err);
      }
    }
    return getStorageItem<ContactInfoData>('contacts', DEFAULT_CONTACTS);
  },

  async saveContacts(contacts: ContactInfoData): Promise<ContactInfoData> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('contacts').upsert({
          id: 'contact-default',
          ...contacts,
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save contacts failed:', err);
      }
    }
    setStorageItem('contacts', contacts);
    return contacts;
  },

  async getSettings(): Promise<WebsiteSettings> {
    let settingsData: WebsiteSettings;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('settings').select('*').single();
        if (error) {
          if (error.code === 'PGRST116') {
            settingsData = DEFAULT_SETTINGS;
          } else {
            throw error;
          }
        } else {
          settingsData = data;
        }
      } catch (err) {
        console.warn('Supabase fetch settings failed, falling back to local storage', err);
        settingsData = getStorageItem<WebsiteSettings>('settings', DEFAULT_SETTINGS);
      }
    } else {
      settingsData = getStorageItem<WebsiteSettings>('settings', DEFAULT_SETTINGS);
    }

    // Auto-migrate old/empty values in local storage to use the new logo and theme
    if (!settingsData.logo_url || settingsData.logo_url === '' || settingsData.theme_primary === '#173B8C') {
      settingsData.logo_url = DEFAULT_SETTINGS.logo_url;
      settingsData.theme_primary = DEFAULT_SETTINGS.theme_primary;
      settingsData.theme_secondary = DEFAULT_SETTINGS.theme_secondary;
      if (!isSupabaseConfigured) {
        setStorageItem('settings', settingsData);
      }
    }
    return settingsData;
  },

  async saveSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('settings').upsert({
          id: 'settings-default',
          ...settings,
          updated_at: new Date().toISOString()
        }).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Supabase save settings failed:', err);
      }
    }
    setStorageItem('settings', settings);
    return settings;
  },

  // Media / File upload to buckets helper
  async uploadMedia(file: File, bucketName: string): Promise<string> {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase!.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase!.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (err) {
        console.error(`Media upload error for ${bucketName}:`, err);
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
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('founders_team')
          .select('*')
          .order('display_order', { ascending: true });
        if (error) throw error;
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
        console.warn('Supabase fetch team_members failed, falling back to local storage', err);
      }
    }
    return getStorageItem<TeamMember[]>('team_members', DEFAULT_TEAM_MEMBERS);
  },

  async saveTeamMember(member: TeamMember): Promise<TeamMember> {
    if (isSupabaseConfigured) {
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
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!.from('founders_team').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase delete team member failed:', err);
      }
    }
    const members = getStorageItem<TeamMember[]>('team_members', DEFAULT_TEAM_MEMBERS);
    const filtered = members.filter((m) => m.id !== id);
    setStorageItem('team_members', filtered);
    return true;
  },

  async deleteMedia(url: string, bucketName: string): Promise<boolean> {
    if (isSupabaseConfigured && url && url.includes(bucketName)) {
      try {
        // Extract file path from public URL
        const urlParts = url.split(`/${bucketName}/`);
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          const { error } = await supabase!.storage
            .from(bucketName)
            .remove([filePath]);
          if (error) throw error;
          return true;
        }
      } catch (err) {
        console.error(`Media delete error for ${bucketName}:`, err);
      }
    }
    return true;
  }
};
