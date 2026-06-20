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
  location: string;
  description: string;
  image_url: string;
  phone: string;
  email: string;
  address?: string;
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

