import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Link2, Users } from 'lucide-react';
import { EventService } from '@/services/EventService';
import { supabase } from '@/lib/supabase';
import { EVENT_CATEGORIES, EVENT_TYPES } from '@/lib/eventConstants';
import { cn } from '@/lib/utils';
import {
  toSlug, FieldLabel, FormInput, FormSelect, FormSection,
  AutoTextarea, SlugField, ImageUploadField, TakeawayEditor,
  Toast, useKeyboardShortcuts,
} from './AdminFormUI';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import type { TakeawayItem } from './AdminFormUI';
import { AdminRegistrations } from './AdminRegistrations';
import type { Event, EventSpeaker } from '@/types/events';

// ── Types ────────────────────────────────────────────────────────────────────

type FormState = Omit<Event, 'id' | 'created_at' | 'key_takeaways' | 'speakers'> & {
  takeaways: TakeawayItem[];
  speakers: EventSpeaker[];
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
  takeaways: [],
  speakers: [],
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseDate(iso: string | null) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

// ── Speaker editor ───────────────────────────────────────────────────────────

function SpeakerEditor({
  speakers,
  onChange,
  onPhotoUpload,
}: {
  speakers: EventSpeaker[];
  onChange: (s: EventSpeaker[]) => void;
  onPhotoUpload: (index: number, file: File) => Promise<void>;
}) {
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  function add() { onChange([...speakers, { name: '', title: '', photo_url: null }]); }
  function remove(i: number) { onChange(speakers.filter((_, idx) => idx !== i)); }
  function update(i: number, key: keyof EventSpeaker, val: string | null) {
    onChange(speakers.map((s, idx) => idx === i ? { ...s, [key]: val } : s));
  }

  async function handleUpload(i: number, file: File) {
    setUploadingIdx(i);
    try { await onPhotoUpload(i, file); }
    finally { setUploadingIdx(null); }
  }

  return (
    <div className="flex flex-col gap-3">
      {speakers.map((speaker, i) => (
        <div key={i} className="border border-white/[0.07] p-4 flex flex-col gap-3 relative">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Name</FieldLabel>
              <FormInput value={speaker.name} onChange={v => update(i, 'name', v)} placeholder="Speaker name" />
            </div>
            <div>
              <FieldLabel>Title / Role</FieldLabel>
              <FormInput value={speaker.title ?? ''} onChange={v => update(i, 'title', v)} placeholder="e.g. Cloud Architect" />
            </div>
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <FieldLabel>Photo</FieldLabel>
              <ImageUploadField
                value={speaker.photo_url ?? ''}
                onChange={v => update(i, 'photo_url', v || null)}
                onUpload={file => handleUpload(i, file)}
                uploading={uploadingIdx === i}
                variant="avatar"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="shrink-0 p-2.5 mb-0.5 text-white/25 hover:text-red-400/70 transition-colors border border-white/[0.07]"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors border border-dashed border-white/[0.08] px-4 py-2.5 hover:border-white/20"
      >
        <Plus size={12} /> Add speaker
      </button>
    </div>
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
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, true>>>({});

  function field<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    if (key in errors) setErrors(prev => { const next = { ...prev }; delete next[key as keyof typeof next]; return next; });
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim())    e.title    = true;
    if (!form.slug.trim())     e.slug     = true;
    if (!form.category.trim()) e.category = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    setError(null);
    try { await onSave(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Save failed.'); }
    finally { setSaving(false); }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const url = await EventService.uploadImage(file);
      setForm(f => ({ ...f, hero_image_url: url }));
    } catch { setError('Image upload failed.'); }
    finally { setUploading(false); }
  }

  async function handleSpeakerPhotoUpload(index: number, file: File) {
    const ext = file.name.split('.').pop();
    const path = `events/speakers/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('assets').upload(path, file);
    if (uploadError) throw uploadError;
    const url = supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
    setForm(f => ({
      ...f,
      speakers: f.speakers.map((s, i) => i === index ? { ...s, photo_url: url } : s),
    }));
  }

  useKeyboardShortcuts({ onClose, onSave: handleSave });

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-white/[0.07] shrink-0 bg-[#0a0a0a]">
        <div>
          <h2 className="text-[17px] font-semibold text-white">
            {editingId ? 'Edit Event' : 'New Event'}
          </h2>
          <p className="text-[11px] text-white/25 mt-0.5">Ctrl+Enter to save · Esc to close</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="px-5 py-2 text-[13px] text-white/40 hover:text-white/70 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-6 py-2 bg-white text-black text-[13px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create event'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
      <div className="max-w-[860px] mx-auto px-8 py-8 flex flex-col gap-7">

          <FormSection title="Identity">
            <div>
              <FieldLabel required error={!!errors.title}>Title</FieldLabel>
              <FormInput
                value={form.title}
                error={!!errors.title}
                onChange={v => setForm(p => ({
                  ...p,
                  title: v,
                  ...(!editingId ? { slug: toSlug(v) } : {}),
                }))}
              />
            </div>
            <div>
              <FieldLabel required error={!!errors.slug}>Slug</FieldLabel>
              <SlugField
                value={form.slug}
                onChange={v => field('slug', v)}
                editingId={editingId}
                onRegenerate={() => field('slug', toSlug(form.title))}
                error={!!errors.slug}
              />
            </div>
            <div>
              <FieldLabel>Description</FieldLabel>
              <RichTextEditor
                value={form.description ?? ''}
                onChange={v => field('description', v)}
                placeholder="Describe the event…"
                minHeight={160}
              />
            </div>
          </FormSection>

          <FormSection title="Classification">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required error={!!errors.category}>Category</FieldLabel>
                <FormSelect
                  value={form.category}
                  onChange={v => field('category', v as FormState['category'])}
                  options={EVENT_CATEGORIES}
                  error={!!errors.category}
                />
              </div>
              <div>
                <FieldLabel required>Type</FieldLabel>
                <FormSelect
                  value={form.type}
                  onChange={v => field('type', v as FormState['type'])}
                  options={EVENT_TYPES}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Status</FieldLabel>
                <FormSelect
                  value={form.status}
                  onChange={v => field('status', v as FormState['status'])}
                  options={[
                    { value: 'upcoming',  label: 'Upcoming'  },
                    { value: 'on_demand', label: 'On Demand' },
                  ]}
                />
              </div>
              <div>
                <FieldLabel>Event Date</FieldLabel>
                <FormInput
                  type="datetime-local"
                  value={form.event_date ?? ''}
                  onChange={v => field('event_date', v)}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Media">
            <div>
              <FieldLabel>Hero Image</FieldLabel>
              <ImageUploadField
                value={form.hero_image_url ?? ''}
                onChange={v => field('hero_image_url', v)}
                onUpload={handleImageUpload}
                uploading={uploading}
              />
            </div>
          </FormSection>

          <FormSection title="Key Takeaways">
            <TakeawayEditor
              items={form.takeaways}
              onChange={items => field('takeaways', items)}
            />
          </FormSection>

          <FormSection title="Speakers">
            <SpeakerEditor
              speakers={form.speakers}
              onChange={speakers => field('speakers', speakers)}
              onPhotoUpload={handleSpeakerPhotoUpload}
            />
          </FormSection>

          {error && <p className="text-[13px] text-red-400/70">{error}</p>}
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
  const [events, setEvents]               = useState<Event[]>([]);
  const [regCounts, setRegCounts]         = useState<Record<string, number>>({});
  const [loading, setLoading]             = useState(true);
  const [showForm, setShowForm]           = useState(false);
  const [editingId, setEditingId]         = useState<string | null>(null);
  const [form, setForm]                   = useState<FormState>(EMPTY_FORM);
  const [regsEvent, setRegsEvent]         = useState<Event | null>(null);
  const [deletingId, setDeletingId]       = useState<string | null>(null);
  const [toast, setToast]                 = useState<string | null>(null);

  async function loadEvents() {
    setLoading(true);
    try {
      const evts = await EventService.getEvents();
      setEvents(evts);

      // Fetch registration counts for all events in one query
      const { data } = await supabase
        .from('registrations')
        .select('event_id')
        .in('event_id', evts.map(e => e.id));

      if (data) {
        const counts: Record<string, number> = {};
        for (const row of data) {
          counts[row.event_id] = (counts[row.event_id] ?? 0) + 1;
        }
        setRegCounts(counts);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEvents(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(event: Event) {
    setForm({
      title:          event.title,
      slug:           event.slug,
      description:    event.description ?? '',
      hero_image_url: event.hero_image_url ?? '',
      category:       event.category,
      type:           event.type,
      status:         event.status,
      event_date:     parseDate(event.event_date),
      takeaways:      event.key_takeaways,
      speakers:       event.speakers ?? [],
    });
    setEditingId(event.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    await EventService.deleteEvent(id);
    setDeletingId(null);
    loadEvents();
  }

  async function handleSave() {
    const payload = {
      title:          form.title,
      slug:           form.slug,
      description:    form.description || null,
      hero_image_url: form.hero_image_url || null,
      category:       form.category,
      type:           form.type,
      status:         form.status,
      event_date:     form.event_date || null,
      key_takeaways:  form.takeaways,
      speakers:       form.speakers,
    };

    if (editingId) {
      await EventService.updateEvent(editingId, payload);
    } else {
      await EventService.createEvent(payload as Omit<Event, 'id' | 'created_at'>);
    }
    setShowForm(false);
    loadEvents();
    setToast('Event saved successfully.');
  }

  if (regsEvent) {
    return <AdminRegistrations event={regsEvent} onBack={() => setRegsEvent(null)} />;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[24px] font-semibold text-white">Events</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-white text-black text-[13px] font-semibold px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          <Plus size={15} /> New Event
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />)}
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
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Title', 'Category', 'Type', 'Status', 'Date', 'Registrations', ''].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {event.hero_image_url && (
                        <img src={event.hero_image_url} alt="" className="w-8 h-8 object-cover border border-white/[0.06] shrink-0" />
                      )}
                      <span className="text-white font-medium truncate max-w-[200px]">{event.title}</span>
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
                    {event.event_date
                      ? new Date(event.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setRegsEvent(event)}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-blue-400/70 hover:text-blue-300 transition-colors"
                      title="View registrations"
                    >
                      <Users size={12} className="shrink-0" />
                      {regCounts[event.id] ?? 0}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className={cn('flex gap-1 justify-end transition-opacity', deletingId === event.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                      <a href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="View">
                        <Link2 size={15} />
                      </a>
                      <button onClick={() => openEdit(event)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      {deletingId === event.id ? (
                        <span className="flex items-center gap-1.5 ml-1 text-[13px]">
                          <button onClick={() => handleDelete(event.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                            Confirm
                          </button>
                          <button onClick={() => setDeletingId(null)} className="text-white/30 hover:text-white/60 transition-colors">
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setDeletingId(event.id)} className="p-1.5 text-white/30 hover:text-red-400/70 transition-colors" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <EventFormModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
        />
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
