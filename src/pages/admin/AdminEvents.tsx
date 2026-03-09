import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Link2 } from 'lucide-react';
import { EventService } from '@/services/EventService';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/lib/eventConstants';
import { cn } from '@/lib/utils';
import type { Event } from '@/types/events';

// ── Types ────────────────────────────────────────────────────────────────────

type FormState = Omit<Event, 'id' | 'created_at' | 'key_takeaways'> & {
  key_takeaways_raw: string;
};

const EMPTY_FORM: FormState = {
  title: '',
  slug: '',
  description: '',
  hero_image_url: '',
  category: 'workplace-ai',
  type: 'webinar',
  status: 'upcoming',
  event_date: '',
  key_takeaways_raw: '[]',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

function parseDate(iso: string | null) {
  if (!iso) return '';
  return iso.slice(0, 16); // "YYYY-MM-DDTHH:MM"
}

// ── Sub-components ───────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[10px] uppercase tracking-[0.15em] text-white/30 font-medium mb-2">
      {children}{required && <span className="text-white/15 ml-0.5">*</span>}
    </label>
  );
}

function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={cn(
        'w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-white text-[13px] outline-none focus:border-white/25 transition-colors placeholder:text-white/15',
        className,
      )}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-[#111] border border-white/[0.08] px-3 py-2.5 text-white text-[13px] outline-none focus:border-white/25 transition-colors"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

// ── EventForm modal ──────────────────────────────────────────────────────────

function EventFormModal({
  form,
  setForm,
  editingId,
  onClose,
  onSave,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  editingId: string | null;
  onClose: () => void;
  onSave: () => Promise<void>;
}) {
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const url = await EventService.uploadImage(file);
      setForm(f => ({ ...f, hero_image_url: url }));
    } catch {
      setError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await onSave();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed.');
    } finally {
      setSaving(false);
    }
  }

  function field(key: keyof FormState, val: string) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e0e] border border-white/[0.08] w-full max-w-lg max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-white/[0.06] sticky top-0 bg-[#0e0e0e] z-10">
          <h2 className="text-[15px] font-semibold text-white">
            {editingId ? 'Edit Event' : 'New Event'}
          </h2>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-7 py-6 flex flex-col gap-5">
          {/* Title */}
          <div>
            <FieldLabel required>Title</FieldLabel>
            <Input
              value={form.title}
              onChange={v => setForm(p => ({ ...p, title: v, ...(!editingId ? { slug: toSlug(v) } : {}) }))}
            />
          </div>

          {/* Slug */}
          <div>
            <FieldLabel required>Slug</FieldLabel>
            <Input value={form.slug} onChange={v => field('slug', v)} />
          </div>

          {/* Description */}
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={form.description ?? ''}
              onChange={e => field('description', e.target.value)}
              rows={3}
              className="w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-white text-[13px] outline-none focus:border-white/25 transition-colors resize-none placeholder:text-white/15"
            />
          </div>

          {/* Category + Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Category</FieldLabel>
              <Select value={form.category} onChange={v => field('category', v)} options={EVENT_CATEGORIES} />
            </div>
            <div>
              <FieldLabel required>Type</FieldLabel>
              <Select value={form.type} onChange={v => field('type', v)} options={EVENT_TYPES} />
            </div>
          </div>

          {/* Status + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Status</FieldLabel>
              <Select
                value={form.status}
                onChange={v => field('status', v)}
                options={[
                  { value: 'upcoming',  label: 'Upcoming' },
                  { value: 'on_demand', label: 'On Demand' },
                ]}
              />
            </div>
            <div>
              <FieldLabel>Event Date</FieldLabel>
              <Input
                type="datetime-local"
                value={form.event_date ?? ''}
                onChange={v => field('event_date', v)}
              />
            </div>
          </div>

          {/* Hero image */}
          <div>
            <FieldLabel>Hero Image</FieldLabel>
            <div className="flex gap-2">
              <Input
                value={form.hero_image_url ?? ''}
                onChange={v => field('hero_image_url', v)}
                placeholder="Paste URL or upload →"
              />
              <label
                className={cn(
                  'shrink-0 flex items-center gap-1.5 px-3 py-2 border border-white/[0.08] text-[11px] text-white/40 cursor-pointer hover:border-white/25 hover:text-white/70 transition-colors',
                  uploading && 'opacity-50 pointer-events-none',
                )}
              >
                {uploading ? <span className="animate-pulse">…</span> : <Upload size={13} />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />
              </label>
            </div>
            {form.hero_image_url && (
              <div className="mt-2 relative h-24 overflow-hidden border border-white/[0.06]">
                <img src={form.hero_image_url} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Key takeaways */}
          <div>
            <FieldLabel>Key Takeaways (JSON)</FieldLabel>
            <textarea
              value={form.key_takeaways_raw}
              onChange={e => field('key_takeaways_raw', e.target.value)}
              rows={5}
              spellCheck={false}
              className="w-full bg-white/[0.04] border border-white/[0.08] px-3 py-2.5 text-white/70 text-[12px] font-mono outline-none focus:border-white/25 transition-colors resize-none"
              placeholder='[{"icon":"brain","text":"..."}]'
            />
            <p className="mt-1 text-[10px] text-white/20">
              Icons: brain · rocket · fingerprint · check · zap · shield · cloud · bot
            </p>
          </div>

          {error && <p className="text-[12px] text-red-400/70">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-white/[0.06] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-[12px] text-white/40 hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
  upcoming:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  on_demand: 'bg-white/[0.05] text-white/40 border-white/10',
};

export function AdminEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  function loadEvents() {
    setLoading(true);
    EventService.getEvents().then(setEvents).finally(() => setLoading(false));
  }

  useEffect(() => { loadEvents(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(event: Event) {
    setForm({
      title: event.title,
      slug: event.slug,
      description: event.description ?? '',
      hero_image_url: event.hero_image_url ?? '',
      category: event.category,
      type: event.type,
      status: event.status,
      event_date: parseDate(event.event_date),
      key_takeaways_raw: JSON.stringify(event.key_takeaways, null, 2),
    });
    setEditingId(event.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event? This will also delete all registrations.')) return;
    await EventService.deleteEvent(id);
    loadEvents();
  }

  async function handleSave() {
    let takeaways = [];
    try {
      takeaways = JSON.parse(form.key_takeaways_raw);
    } catch {
      throw new Error('Invalid JSON in key takeaways.');
    }

    const payload = {
      title:         form.title,
      slug:          form.slug,
      description:   form.description || null,
      hero_image_url: form.hero_image_url || null,
      category:      form.category,
      type:          form.type,
      status:        form.status,
      event_date:    form.event_date || null,
      key_takeaways: takeaways,
    };

    if (editingId) {
      await EventService.updateEvent(editingId, payload);
    } else {
      await EventService.createEvent(payload as Omit<Event, 'id' | 'created_at'>);
    }
    setShowForm(false);
    loadEvents();
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[22px] font-semibold text-white">Events</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-white text-black text-[12px] font-semibold px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          <Plus size={14} /> New Event
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <p className="text-white/20 text-[13px] mb-3">No events yet.</p>
          <button onClick={openCreate} className="text-[11px] text-white/35 hover:text-white/60 transition-colors underline">
            Create your first event
          </button>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Title', 'Category', 'Type', 'Status', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {event.hero_image_url && (
                        <img
                          src={event.hero_image_url}
                          alt=""
                          className="w-8 h-8 object-cover border border-white/[0.06] shrink-0"
                        />
                      )}
                      <span className="text-white font-medium truncate max-w-[220px]">{event.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-white/40 whitespace-nowrap">{event.category}</td>
                  <td className="px-4 py-3.5 text-white/40 capitalize">{event.type}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn('text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 border', STATUS_STYLE[event.status])}>
                      {event.status === 'on_demand' ? 'On Demand' : 'Upcoming'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-white/30 font-mono whitespace-nowrap">
                    {event.event_date ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <a
                        href={`/events/${event.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors"
                        title="View"
                      >
                        <Link2 size={13} />
                      </a>
                      <button
                        onClick={() => openEdit(event)}
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1.5 text-white/30 hover:text-red-400/70 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <EventFormModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}
