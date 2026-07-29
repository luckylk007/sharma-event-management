import slugify from 'slugify';

export const createSlug = (text: string): string => {
  return slugify(text, { lower: true, strict: true, trim: true });
};

export const calculateReadingTime = (content: string): number => {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};
