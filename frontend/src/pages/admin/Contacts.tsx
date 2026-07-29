import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { FiTrash2, FiEye, FiDownload, FiMail, FiPhone, FiCalendar } from 'react-icons/fi';
import { contactsApi } from '@/api';
import type { Contact, ContactStatus } from '@/types';
import { PageHeader } from '@/components/admin/PageHeader';
import { Pagination } from '@/components/admin/Pagination';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Skeleton } from '@/components/ui/Skeleton';

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Read', value: 'read' },
  { label: 'Replied', value: 'replied' },
  { label: 'Archived', value: 'archived' },
];

const STATUS_UPDATE_OPTIONS: { label: string; value: ContactStatus }[] = [
  { label: 'New', value: 'new' },
  { label: 'Read', value: 'read' },
  { label: 'Replied', value: 'replied' },
  { label: 'Archived', value: 'archived' },
];

function statusVariant(status: ContactStatus) {
  switch (status) {
    case 'new':
      return 'gold' as const;
    case 'replied':
      return 'success' as const;
    case 'archived':
      return 'muted' as const;
    default:
      return 'outline' as const;
  }
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Contact | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const loadContacts = useCallback(() => {
    setIsLoading(true);
    contactsApi
      .getAll({ page, limit: 20, status: status === 'all' ? undefined : status })
      .then((res) => {
        setContacts(res.data);
        setPages(res.pages);
        setTotal(res.total);
      })
      .catch((error) => {
        toast.error(error instanceof Error ? error.message : 'Failed to load enquiries');
      })
      .finally(() => setIsLoading(false));
  }, [page, status]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    setPage(1);
  }, [status]);

  const handleStatusChange = async (id: string, newStatus: ContactStatus) => {
    setUpdatingId(id);
    try {
      await contactsApi.updateStatus(id, newStatus);
      setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
      if (viewing?._id === id) setViewing((prev) => (prev ? { ...prev, status: newStatus } : prev));
      toast.success('Status updated');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete enquiry from "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await contactsApi.remove(id);
      toast.success('Enquiry deleted');
      if (viewing?._id === id) setViewing(null);
      loadContacts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete enquiry');
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewContact = (contact: Contact) => {
    setViewing(contact);
    if (contact.status === 'new') {
      handleStatusChange(contact._id, 'read');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = (await contactsApi.exportCsv()) as unknown as Blob;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Contacts"
        description={`Manage customer enquiries${total ? ` — ${total} total` : ''}.`}
        actions={
          <Button
            variant="outline"
            icon={<FiDownload />}
            iconPosition="left"
            isLoading={isExporting}
            onClick={handleExport}
          >
            Export CSV
          </Button>
        }
      />

      <div className="mb-6 w-full sm:w-56">
        <Select
          label="Filter by Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={STATUS_OPTIONS}
        />
      </div>

      <div className="overflow-x-auto border border-[var(--color-line)]">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-line)] bg-[var(--color-charcoal)] text-xs uppercase tracking-widest text-[var(--color-muted)]">
              <th className="px-5 py-4 font-medium">Name</th>
              <th className="px-5 py-4 font-medium">Contact</th>
              <th className="px-5 py-4 font-medium">Subject</th>
              <th className="px-5 py-4 font-medium">Status</th>
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
            ) : contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[var(--color-muted)]">
                  No enquiries found.
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact._id} className="text-[var(--color-cream)]">
                  <td className="max-w-[160px] px-5 py-4">
                    <p className="truncate">{contact.name}</p>
                  </td>
                  <td className="px-5 py-4 text-[var(--color-muted)]">
                    <p className="truncate text-xs">{contact.email}</p>
                    <p className="truncate text-xs">{contact.phone}</p>
                  </td>
                  <td className="max-w-[200px] px-5 py-4">
                    <p className="truncate">{contact.subject}</p>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={contact.status}
                      disabled={updatingId === contact._id}
                      onChange={(e) => handleStatusChange(contact._id, e.target.value as ContactStatus)}
                      className="border-none bg-transparent text-xs uppercase tracking-widest focus:outline-none"
                    >
                      {STATUS_UPDATE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="bg-[var(--color-charcoal)] text-[var(--color-cream)]">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <div className="mt-1">
                      <Badge variant={statusVariant(contact.status)}>{contact.status}</Badge>
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-[var(--color-muted)]">
                    {format(new Date(contact.createdAt), 'dd MMM yyyy')}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleViewContact(contact)}
                        aria-label="View enquiry"
                        className="text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
                      >
                        <FiEye size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(contact._id, contact.name)}
                        disabled={deletingId === contact._id}
                        aria-label="Delete enquiry"
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

      <Modal isOpen={!!viewing} onClose={() => setViewing(null)} title="Enquiry Details" size="lg">
        {viewing && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Name</p>
                <p className="mt-1 text-[var(--color-cream)]">{viewing.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Status</p>
                <Badge variant={statusVariant(viewing.status)} className="mt-1">
                  {viewing.status}
                </Badge>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  <FiMail size={12} /> Email
                </p>
                <a href={`mailto:${viewing.email}`} className="mt-1 block text-[var(--color-gold)] hover:underline">
                  {viewing.email}
                </a>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                  <FiPhone size={12} /> Phone
                </p>
                <a href={`tel:${viewing.phone}`} className="mt-1 block text-[var(--color-gold)] hover:underline">
                  {viewing.phone}
                </a>
              </div>
              {viewing.service && (
                <div>
                  <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Service</p>
                  <p className="mt-1 text-[var(--color-cream)]">{viewing.service}</p>
                </div>
              )}
              {viewing.eventDate && (
                <div>
                  <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-[var(--color-muted)]">
                    <FiCalendar size={12} /> Event Date
                  </p>
                  <p className="mt-1 text-[var(--color-cream)]">
                    {format(new Date(viewing.eventDate), 'dd MMM yyyy')}
                  </p>
                </div>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Subject</p>
              <p className="mt-1 text-[var(--color-cream)]">{viewing.subject}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">Message</p>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--color-cream)]/90">
                {viewing.message}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--color-line)] pt-4 text-xs text-[var(--color-muted)]">
              <span>Received {format(new Date(viewing.createdAt), 'dd MMM yyyy, hh:mm a')}</span>
              <span>Source: {viewing.source}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
