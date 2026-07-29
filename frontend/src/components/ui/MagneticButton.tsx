import { useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
}

export function MagneticButton({ children, className, strength = 0.35, onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * strength, y: y * strength });
  };

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.2 }}
      className={cn('inline-block cursor-pointer', className)}
    >
      {children}
    </motion.div>
  );
}
