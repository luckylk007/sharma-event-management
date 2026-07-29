import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { SITE } from '@/constants';

export function FloatingWhatsApp() {
  const message = encodeURIComponent(
    "Hi Sharma Events! I'd like to enquire about planning an event."
  );
  const href = `https://wa.me/${SITE.whatsapp.replace('+', '')}?text=${message}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center bg-[#25D366] text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:bottom-8 sm:right-8"
    >
      <span className="absolute inset-0 animate-ping bg-[#25D366] opacity-40" />
      <FaWhatsapp size={26} className="relative" />
    </motion.a>
  );
}
