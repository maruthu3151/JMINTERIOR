export type ProjectCategory = 
  | 'Interior Design'
  | 'Kitchen'
  | 'Living Hall'
  | 'Bedroom'
  | 'Office'
  | 'Others';

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: ProjectCategory;
  description: string;
  coverImage: string;
  galleryImages: string[];
  beforeImage?: string;
  afterImage?: string;
  materials: string[];
  budget?: string;
  status: 'Completed' | 'Ongoing' | 'Upcoming';
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCategory = 'All' | 'Kitchen' | 'Bedroom' | 'Living Hall' | 'Office' | 'Other';

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  category: 'Kitchen' | 'Bedroom' | 'Living Hall' | 'Office' | 'Other';
  description?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  features: string[];
  startingPrice?: string;
  order: number;
  isPublished: boolean;
}

export interface MaterialItem {
  id: string;
  name: string;
  description: string;
  properties: string;
  durability: string;
  finish: string;
  usage: string;
  imageUrl?: string;
  isPublished: boolean;
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  projectType: string;
  message: string;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  adminNotes?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: 'unread' | 'read' | 'contacted';
  createdAt: string;
}

export interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  reviewText: string;
  avatarUrl?: string;
  projectType?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  description: string;
  logoUrl: string;
  ownerName: string;
  experienceYears: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  aboutTitle: string;
  aboutDescription: string;
  designPhilosophy: string;
  socialInstagram: string;
  socialFacebook: string;
  socialYouTube: string;
  footerText: string;
  appointmentNotice: string;
  updatedAt: string;
}

export interface AdminProfile {
  username: string;
  email: string;
  updatedAt: string;
}
