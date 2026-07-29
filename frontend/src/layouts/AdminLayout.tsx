import { useState } from 'react';
import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import {
  FiGrid,
  FiFileText,
  FiBriefcase,
  FiImage,
  FiMail,
  FiSettings,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/utils/cn';

const ADMIN_NAV = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: FiGrid },
  { label: 'Blogs', to: '/admin/blogs', icon: FiFileText },
  { label: 'Services', to: '/admin/services', icon: FiBriefcase },
  { label: 'Gallery', to: '/admin/gallery', icon: FiImage },
  { label: 'Testimonials', to: '/admin/testimonials', icon: FiStar },
  { label: 'Contacts', to: '/admin/contacts', icon: FiMail },
  { label: 'Settings', to: '/admin/settings', icon: FiSettings },
];

export function AdminLayout() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-ink)]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-ink)]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-[var(--color-line)] bg-[var(--color-charcoal)] transition-transform duration-300 lg:static lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-[var(--color-line)] px-6">
          <Link to="/admin/dashboard" className="font-display text-xl text-[var(--color-cream)]">
            Sharma <span className="text-[var(--color-gold)]">Admin</span>
          </Link>
          <button
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="text-[var(--color-muted)] lg:hidden"
          >
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 px-4 py-6">
          {ADMIN_NAV.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200',
                  isActive
                    ? 'border-l-2 border-[var(--color-gold)] bg-[var(--color-gold)]/10 text-[var(--color-gold)]'
                    : 'border-l-2 border-transparent text-[var(--color-muted)] hover:text-[var(--color-cream)]'
                )
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-[var(--color-line)] p-4">
          <div className="mb-3 px-2">
            <p className="truncate text-sm text-[var(--color-cream)]">{user?.name}</p>
            <p className="truncate text-xs uppercase tracking-widest text-[var(--color-muted)]">
              {user?.role}
            </p>
          </div>
          <button
            onClick={() => logout()}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-gold)]"
          >
            <FiLogOut size={16} />
            Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 flex-col lg:pl-0">
        <header className="flex h-20 items-center border-b border-[var(--color-line)] px-6 lg:hidden">
          <button
            aria-label="Open sidebar"
            onClick={() => setSidebarOpen(true)}
            className="text-[var(--color-cream)]"
          >
            <FiMenu size={22} />
          </button>
        </header>
        <main className="flex-1 p-6 sm:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
