import { useEffect } from 'react';
import { SITE } from '@/constants';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} | ${SITE.name}` : SITE.fullName;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
