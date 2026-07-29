import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiSearch, FiEye } from 'react-icons/fi';
import { blogsApi } from '@/api';
import type { Blog } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Pagination } from '@/components/admin/Pagination';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
];

export default function Blogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const loadBlogs = useCallback(() => {
    setIsLoading(true);
    blogsApi
      .getAll({
        page,
        limit: 10,
        published: 'all',
        search: debouncedSearch || undefined,
      })
      .then((res) => {
        setBlogs(res.data);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load blogs');
      })
      .finally(() => setIsLoading(false));
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadBlogs();
  }, [loadBlogs]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const filteredBlogs = blogs.filter((blog) => {
    if (status === 'published') return blog.isPublished;
    if (status === 'draft') return !blog.isPublished;
    return true;
  });

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete blog "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await blogsApi.remove(id);
      toast.success('Blog deleted');
      loadBlogs();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete blog');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Blogs"
        description={`Manage your blog posts${total ? ` — ${total} total` : ''}.`}
        actions={
          <Link to="/admin/blogs/new">
            <Button icon={<FiPlus />} iconPosition="left">
              New Blog
            </Button>
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <FiSearch className="pointer-events-none absolute left-0.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title..."
            className="pl-6"
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={STATUS_OPTIONS}
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-[var(--color-line)]">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-charcoal)] text-xs uppercase tracking-widest text-[var(--color-muted)]">
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Category</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium">Views</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-line)]">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-4" colSpan={6}>
                    <Skeleton className="h-5 w-full" />
                  </td>
                </tr>
              ))
            ) : filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-muted)]">
                  No blogs found.
                </td>
              </tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog._id} className="text-[var(--color-cream)]">
                  <td className="max-w-xs px-5 py-4">
                    <p className="truncate">{blog.title}</p>
                    <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">/{blog.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">{blog.category || '—'}</td>
                  <td className="px-5 py-4">
                    <Badge variant={blog.isPublished ? 'success' : 'muted'}>
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">
                    <span className="flex items-center gap-1.5">
                      <FiEye size={13} /> {blog.views}
                    </span>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-[var(--color-muted)]">
                    {format(new Date(blog.updatedAt), 'dd MMM yyyy')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {blog.isPublished && (
                        <a
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Preview blog"
                          className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                        >
                          <FiExternalLink size={16} />
                        </a>
                      )}
                      <Link
                        to={`/admin/blogs/${blog._id}/edit`}
                        aria-label="Edit blog"
                        className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                      >
                        <FiEdit2 size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(blog._id, blog.title)}
                        disabled={deletingId === blog._id}
                        aria-label="Delete blog"
                        className="text-[var(--color-muted)] transition-colors hover:text-red-400 disabled:opacity-50"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pages={pages} onChange={setPage} />
    </div>
  );
}
