export interface HomeContent {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_description: string;
  partner_button_text: string;
  explore_button_text: string;
  updated_at?: string;
}

export interface AboutContent {
  id: string;
  about_title: string;
  about_description: string;
  ecosystem_title: string;
  ecosystem_description: string;
  opportunities_title: string;
  opportunities_description: string;
  updated_at?: string;
}

export interface Branch {
  id: string;
  name: string;
  location: string; // maps to map_link in Supabase
  description: string;
  image_url: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
  partner_link: string;
  category: string;
  features: string[];
  specs: { [key: string]: string };
  whatsapp_number?: string;
  is_featured?: boolean;
  created_at?: string;
  
  // New fields for products table
  full_description?: string;
  brochure_url?: string;
  display_order?: number;
  is_active?: boolean;
  updated_at?: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  company: string;
  rating: number; // 1 to 5
  text: string;
  date: string;
  verified: boolean;
  image_url: string;
  created_at?: string;
  
  // New fields for testimonials table
  display_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
  updated_at?: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  linkedin_url: string;
  achievement_count?: string;
  achievement_text?: string;
  created_at?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  company: string;
  message: string;
  type: 'Partner' | 'Investor' | 'Customer' | 'Other';
  created_at: string;
}

export interface SuccessStory {
  id: string;
  name: string;
  achievement: string;
  image: string;
  stars: number;
  created_at?: string;
}

export interface ContactInfoData {
  id: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  updated_at?: string;
}

export interface WebsiteSettings {
  id: string;
  company_name: string;
  logo_url?: string;
  favicon_url?: string;
  theme_primary?: string;
  theme_secondary?: string;
  meta_title?: string;
  meta_description?: string;
  updated_at?: string;
}

export interface TeamMember {
  id: string;
  type?: 'founder' | 'co-founder' | 'team_member';
  name: string;
  role: string;
  bio?: string;
  image_url: string;
  linkedin_url?: string;
  email?: string;
  department?: string;
  social_links?: { [key: string]: string } | string;
  display_order: number;
  created_at?: string;
  
  // New fields for founders_team table
  is_founder?: boolean;
  is_cofounder?: boolean;
  is_leadership?: boolean;
  updated_at?: string;
}

export interface MediaLibraryItem {
  id: string;
  title: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  category?: string;
  alt_text?: string;
  display_order?: number;
  is_active?: boolean;
  uploaded_at?: string;
  updated_at?: string;
}

export interface ContactDetails {
  id: string;
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  google_maps_url: string;
  website_url: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  youtube_url: string;
  business_hours: string;
  updated_at?: string;
}

