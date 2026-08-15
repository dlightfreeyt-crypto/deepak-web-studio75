export type GalleryItem = {
  id: string;
  url: string;
  name: string;
  order: number;
  createdAt?: number;
};

export type Feedback = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: number;
};

export type SiteContent = {
  siteName: string;
  tagline: string;
  about: string;
  profileImage: string;
  whatsapp: string;
  contactEmail: string;
  location: string;
  instagram: string;
  linkedin: string;
  backgrounds: Record<string, string>;
  gallery: GalleryItem[];
};