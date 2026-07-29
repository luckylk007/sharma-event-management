import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload } from 'react-icons/fi';
import { uploadApi } from '@/api';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  hint?: string;
}

export function ImageUploadField({ label = 'Image URL', value, onChange, hint }: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadApi.uploadImage(file);
      onChange(res.data.url);
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Input
            label={label}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            hint={hint}
          />
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex h-[46px] shrink-0 items-center gap-2 border border-[var(--color-line)] px-4 text-xs uppercase tracking-widest text-[var(--color-muted)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] disabled:opacity-50"
        >
          {isUploading ? <Spinner size="sm" /> : <FiUpload size={14} />}
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {value && (
        <div className="mt-3 h-28 w-28 overflow-hidden border border-[var(--color-line)] bg-[var(--color-graphite)]">
          <img src={value} alt="preview" className="h-full w-full object-cover" />
        </div>
      )}
    </div>
  );
}
