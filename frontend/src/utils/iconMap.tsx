import * as FaIcons from 'react-icons/fa';
import type { IconType } from 'react-icons';

const iconRegistry = FaIcons as unknown as Record<string, IconType>;

/**
 * Resolves a react-icons/fa component from a CMS-supplied string name
 * (e.g. "FaRing", "FaBriefcase"). Falls back gracefully if the name is
 * missing or unrecognised.
 */
export function getFaIcon(name?: string, fallback: IconType = FaIcons.FaStar): IconType {
  if (!name) return fallback;
  return iconRegistry[name] || fallback;
}
