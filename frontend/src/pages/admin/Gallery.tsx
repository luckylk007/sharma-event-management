import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2, FiEdit2, FiStar, FiX } from 'react-icons/fi';
import { galleryApi } from '@/api';
import type { GalleryCategory, GalleryItem } from '@/types';
import { GALLERY_CATEGORIES } from '@/constants';
import { PageHeader } from '@/components/admin/PageHeader';
import { Pagination } from '@/components/admin/Pagination';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

const CATEGORY_OPTIONS = GALLERY_CATEGORIES.map((c) => ({ label: c, value: c }));
const UPLOAD_CATEGORY_OPTIONS = GALLERY_CATEGORIES.filter((c) => c !== 'All').map((c) => ({
  label: c,
  value: c,
}));

interface EditState {
  item: GalleryItem;
  title: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  isFeatured: boolean;
}

export default function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState<string>('All');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<string>('Wedding');
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadGallery = useCallback(() => {
    setIsLoading(true);
    galleryApi
      .getAll({ page, limit: 20, category: category === 'All' ? undefined : category })
      .then((res) => {
        setItems(res.data);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load gallery');
      })
      .finally(() => setIsLoading(false));
  }, [page, category]);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  useEffect(() => {
    setPage(1);
  }, [category]);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await galleryApi.remove(id);
      toast.success('Image deleted');
      loadGallery();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete image');
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (item: GalleryItem) => {
    setEditState({
      item,
      title: item.title,
      alt: item.image.alt,
      caption: item.image.caption || '',
      category: item.category,
      isFeatured: item.isFeatured,
    });
  };

  const handleSaveEdit = async () => {
    if (!editState) return;
    setIsSavingEdit(true);
    try {
      await galleryApi.update(editState.item._id, {
        title: editState.title,
        category: editState.category,
        isFeatured: editState.isFeatured,
        image: { ...editState.item.image, alt: editState.alt, caption: editState.caption },
      });
      toast.success('Image updated');
      setEditState(null);
      loadGallery();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update image');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFiles || uploadFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      Array.from(uploadFiles).forEach((file) => formData.append('images', file));
      formData.append('category', uploadCategory);
      const res = await galleryApi.uploadImages(formData);
      toast.success(`${res.data.length} image(s) uploaded`);
      setIsUploadOpen(false);
      setUploadFiles(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      loadGallery();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Gallery"
        description={`Manage your gallery images${total ? ` — ${total} total` : ''}.`}
        actions={
          <Button icon={<FiUpload />} iconPosition="left" onClick={() => setIsUploadOpen(true)}>
            Bulk Upload
          </Button>
        }
      />

      <div className="mb-6 w-full sm:w-56">
        <Select
          label="Filter by Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORY_OPTIONS}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="border border-[var(--color-line)] bg-[var(--color-charcoal)] p-16 text-center text-[var(--color-muted)]">
          No images found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <div key={item._id} className="group relative aspect-square overflow-hidden border border-[var(--color-line)] bg-[var(--color-graphite)]">
              <img src={item.image.url} alt={item.image.alt} className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-3 opacity-0 transition-all duration-300 group-hover:bg-black/70 group-hover:opacity-100">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="outline" className="bg-black/60">
                    {item.category}
                  </Badge>
                  {item.isFeatured && (
                    <span className="flex h-7 w-7 items-center justify-center bg-[var(--color-gold)] text-[var(--color-ink)]">
                      <FiStar size={13} />
                    </span>
                  )}
                </div>
                <div>
                  <p className="mb-2 truncate text-xs text-[var(--color-cream)]">{item.title}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="flex h-8 w-8 items-center justify-center border border-[var(--color-line)] bg-[var(--color-charcoal)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                      aria-label="Edit image"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item._id, item.title)}
                      disabled={deletingId === item._id}
                      className="flex h-8 w-8 items-center justify-center border border-[var(--color-line)] bg-[var(--color-charcoal)] text-[var(--color-muted)] transition-colors hover:border-red-400 hover:text-red-400 disabled:opacity-50"
                      aria-label="Delete image"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} />

      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Bulk Upload Images">
        <div className="space-y-6">
          <Select
            label="Category"
            value={uploadCategory}
            onChange={(e) => setUploadCategory(e.target.value)}
            options={UPLOAD_CATEGORY_OPTIONS}
          />
          <div>
            <label className="mb-2 block text-xs uppercase tracking-widest text-[var(--color-muted)]">
              Select Images
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setUploadFiles(e.target.files)}
              className="w-full border border-[var(--color-line)] bg-transparent p-3 text-sm text-[var(--color-cream)] file:mr-4 file:border-0 file:bg-[var(--color-gold)] file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-widest file:text-[var(--color-ink)]"
            />
            {uploadFiles && (
              <p className="mt-2 text-xs text-[var(--color-muted)]">{uploadFiles.length} file(s) selected</p>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} isLoading={isUploading} icon={<FiUpload />} iconPosition="left">
              Upload
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!editState} onClose={() => setEditState(null)} title="Edit Image">
        {editState && (
          <div className="space-y-5">
            <div className="h-40 w-full overflow-hidden border border-[var(--color-line)]">
              <img src={editState.item.image.url} alt={editState.alt} className="h-full w-full object-cover" />
            </div>
            <Input
              label="Title"
              value={editState.title}
              onChange={(e) => setEditState({ ...editState, title: e.target.value })}
            />
            <Select
              label="Category"
              value={editState.category}
              onChange={(e) => setEditState({ ...editState, category: e.target.value as GalleryCategory })}
              options={UPLOAD_CATEGORY_OPTIONS}
            />
            <Input
              label="Alt Text"
              value={editState.alt}
              onChange={(e) => setEditState({ ...editState, alt: e.target.value })}
            />
            <Input
              label="Caption"
              value={editState.caption}
              onChange={(e) => setEditState({ ...editState, caption: e.target.value })}
            />
            <label className="flex items-center gap-3 text-sm text-[var(--color-cream)]">
              <input
                type="checkbox"
                checked={editState.isFeatured}
                onChange={(e) => setEditState({ ...editState, isFeatured: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-gold)]"
              />
              Featured image
            </label>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditState(null)}>
                <FiX className="mr-1" /> Cancel
              </Button>
              <Button onClick={handleSaveEdit} isLoading={isSavingEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
