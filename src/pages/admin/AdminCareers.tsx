import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Link2, Users } from 'lucide-react';
import { CareerService } from '@/services/CareerService';
import { supabase } from '@/lib/supabase';
import { AdminJobApplications } from './AdminJobApplications';
import { cn } from '@/lib/utils';
import {
  toSlug, FieldLabel, FormInput, FormSelect, FormSection,
  AutoTextarea, SlugField, ImageUploadField, TagsInput,
  Toast, useKeyboardShortcuts,
} from './AdminFormUI';
import type { JobPosting, WorkplaceType, JobStatus } from '@/types/career';

// ── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  slug: string;
  summary: string;
  description: string;
  hero_image_url: string;
  workplace_type: WorkplaceType;
  city: string;
  open_to_relocation: boolean;
  specialization: string;
  skills: string[];
  is_hot: boolean;
  status: JobStatus;
};

const EMPTY_FORM: FormState = {
  title:              '',
  slug:               '',
  summary:            '',
  description:        '',
  hero_image_url:     '',
  workplace_type:     'Hybrid',
  city:               '',
  open_to_relocation: false,
  specialization:     '',
  skills:             [],
  is_hot:             false,
  status:             'active',
};

const WORKPLACE_OPTIONS = [
  { value: 'Hybrid', label: 'Hybrid' },
  { value: 'Office', label: 'Office' },
  { value: 'Remote', label: 'Remote' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
];

// ── Toggle ────────────────────────────────────────────────────────────────────

function FormToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group"
    >
      <span className={cn(
        'relative inline-flex h-4 w-7 shrink-0 rounded-full border transition-colors duration-150',
        checked ? 'bg-white border-white' : 'bg-transparent border-white/20 group-hover:border-white/40',
      )}>
        <span className={cn(
          'absolute top-0.5 left-0.5 h-2.5 w-2.5 rounded-full transition-all duration-150',
          checked ? 'translate-x-3 bg-black' : 'translate-x-0 bg-white/30',
        )} />
      </span>
      <span className={cn(
        'text-[12px] transition-colors',
        checked ? 'text-white' : 'text-white/40 group-hover:text-white/65',
      )}>
        {label}
      </span>
    </button>
  );
}

// ── Career Form Modal ────────────────────────────────────────────────────────

function CareerFormModal({
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
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [errors, setErrors]       = useState<Partial<Record<keyof FormState, true>>>({});

  function field<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    if (key in errors) setErrors(prev => { const next = { ...prev }; delete next[key as keyof typeof next]; return next; });
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = true;
    if (!form.slug.trim())  e.slug  = true;
    if (!form.city.trim())  e.city  = true;
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
      const ext = file.name.split('.').pop();
      const path = `careers/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(path, file);
      if (uploadError) throw uploadError;
      const url = supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
      setForm(f => ({ ...f, hero_image_url: url }));
    } catch { setError('Image upload failed.'); }
    finally { setUploading(false); }
  }

  useKeyboardShortcuts({ onClose, onSave: handleSave });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0e0e0e] border border-white/[0.08] w-full max-w-2xl max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-7 py-5 border-b border-white/[0.06] shrink-0">
          <div>
            <h2 className="text-[15px] font-semibold text-white">
              {editingId ? 'Edit Role' : 'New Role'}
            </h2>
            <p className="text-[10px] text-white/25 mt-0.5">Ctrl+Enter to save · Esc to close</p>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/70 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-7 py-6 flex flex-col gap-7">

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
              <FieldLabel>Summary</FieldLabel>
              <AutoTextarea
                value={form.summary}
                onChange={v => field('summary', v)}
                placeholder="2–3 sentence preview shown on the listing page"
                maxChars={400}
                minRows={2}
              />
            </div>
          </FormSection>

          <FormSection title="Description">
            <AutoTextarea
              value={form.description}
              onChange={v => field('description', v)}
              placeholder="Full job description. Supports ## headings, ### subheadings, > blockquotes, and paragraphs."
              minRows={10}
              mono
            />
          </FormSection>

          <FormSection title="Location & Type">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Workplace type</FieldLabel>
                <FormSelect
                  value={form.workplace_type}
                  onChange={v => field('workplace_type', v as WorkplaceType)}
                  options={WORKPLACE_OPTIONS}
                />
              </div>
              <div>
                <FieldLabel required error={!!errors.city}>City</FieldLabel>
                <FormInput
                  value={form.city}
                  error={!!errors.city}
                  onChange={v => field('city', v)}
                  placeholder="e.g. Bangkok, Thailand"
                />
              </div>
            </div>
            <div className="pt-1">
              <FormToggle
                label="Open to relocation"
                checked={form.open_to_relocation}
                onChange={v => field('open_to_relocation', v)}
              />
            </div>
          </FormSection>

          <FormSection title="Classification">
            <div>
              <FieldLabel>Specialization</FieldLabel>
              <FormInput
                value={form.specialization}
                onChange={v => field('specialization', v)}
                placeholder="e.g. Developer, DevOps, Business Analyst"
              />
            </div>
            <div>
              <FieldLabel>Skills</FieldLabel>
              <TagsInput
                tags={form.skills}
                onChange={tags => field('skills', tags)}
              />
            </div>
          </FormSection>

          <FormSection title="Settings">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Status</FieldLabel>
                <FormSelect
                  value={form.status}
                  onChange={v => field('status', v as JobStatus)}
                  options={STATUS_OPTIONS}
                />
              </div>
            </div>
            <div className="pt-1">
              <FormToggle
                label="Mark as Hot"
                checked={form.is_hot}
                onChange={v => field('is_hot', v)}
              />
            </div>
          </FormSection>

          <FormSection title="Media">
            <div>
              <FieldLabel>Hero Image</FieldLabel>
              <ImageUploadField
                value={form.hero_image_url}
                onChange={v => field('hero_image_url', v)}
                onUpload={handleImageUpload}
                uploading={uploading}
              />
            </div>
          </FormSection>

          {error && <p className="text-[12px] text-red-400/70">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-white/[0.06] flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-5 py-2.5 text-[12px] text-white/40 hover:text-white/70 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-6 py-2.5 bg-white text-black text-[12px] font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create role'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export function AdminCareers() {
  const [jobs, setJobs]           = useState<JobPosting[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);
  const [appsJob, setAppsJob]     = useState<JobPosting | null>(null);
  const [appCounts, setAppCounts] = useState<Record<string, number>>({});

  function loadJobs() {
    setLoading(true);
    CareerService.getAllJobs().then(jobs => {
      setJobs(jobs);
      // fetch application counts per job
      supabase
        .from('job_applications')
        .select('job_id')
        .then(({ data }) => {
          const counts: Record<string, number> = {};
          (data ?? []).forEach((r: { job_id: string }) => {
            counts[r.job_id] = (counts[r.job_id] ?? 0) + 1;
          });
          setAppCounts(counts);
        });
    }).finally(() => setLoading(false));
  }

  useEffect(() => { loadJobs(); }, []);

  if (appsJob) {
    return <AdminJobApplications job={appsJob} onBack={() => setAppsJob(null)} />;
  }

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(job: JobPosting) {
    setForm({
      title:              job.title,
      slug:               job.slug,
      summary:            job.summary ?? '',
      description:        job.description ?? '',
      hero_image_url:     job.hero_image_url ?? '',
      workplace_type:     job.workplace_type,
      city:               job.city,
      open_to_relocation: job.open_to_relocation,
      specialization:     job.specialization,
      skills:             job.skills ?? [],
      is_hot:             job.is_hot,
      status:             job.status,
    });
    setEditingId(job.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    await supabase.from('job_postings').delete().eq('id', id);
    setDeletingId(null);
    loadJobs();
  }

  async function handleSave() {
    const payload = {
      title:              form.title,
      slug:               form.slug,
      summary:            form.summary || null,
      description:        form.description || null,
      hero_image_url:     form.hero_image_url || null,
      workplace_type:     form.workplace_type,
      city:               form.city,
      open_to_relocation: form.open_to_relocation,
      specialization:     form.specialization,
      skills:             form.skills,
      is_hot:             form.is_hot,
      status:             form.status,
    };

    if (editingId) {
      const { error } = await supabase.from('job_postings').update(payload).eq('id', editingId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('job_postings').insert(payload);
      if (error) throw new Error(error.message);
    }
    setShowForm(false);
    loadJobs();
    setToast('Role saved successfully.');
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[22px] font-semibold text-white">Career Listings</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-white text-black text-[12px] font-semibold px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          <Plus size={14} /> New Role
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <p className="text-white/20 text-[13px] mb-3">No roles yet.</p>
          <button onClick={openCreate} className="text-[11px] text-white/35 hover:text-white/60 transition-colors underline">
            Create your first role
          </button>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Title', 'Type', 'City', 'Status', 'Applications', ''].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-white font-medium truncate max-w-[220px]">{job.title}</span>
                      {job.is_hot && (
                        <span className="px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white rounded-sm"
                          style={{ background: 'linear-gradient(90deg, #7c3aed, #2563eb)' }}>
                          Hot
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-white/40 whitespace-nowrap">{job.workplace_type}</td>
                  <td className="px-4 py-3.5 text-white/40 truncate max-w-[160px]">{job.city}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'text-[10px] uppercase tracking-[0.1em] font-semibold px-2 py-0.5 rounded-full',
                      job.status === 'active'
                        ? 'text-emerald-400/70 bg-emerald-400/10'
                        : 'text-white/30 bg-white/[0.04]',
                    )}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => setAppsJob(job)}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-blue-400/70 hover:text-blue-300 transition-colors"
                      title="View applications"
                    >
                      <Users size={12} className="shrink-0" />
                      {appCounts[job.id] ?? 0}
                    </button>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className={cn('flex gap-1 justify-end transition-opacity', deletingId === job.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                      <a href={`/careers/${job.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="View">
                        <Link2 size={13} />
                      </a>
                      <button onClick={() => openEdit(job)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="Edit">
                        <Pencil size={13} />
                      </button>
                      {deletingId === job.id ? (
                        <span className="flex items-center gap-1.5 ml-1 text-[11px]">
                          <button onClick={() => handleDelete(job.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                            Confirm
                          </button>
                          <button onClick={() => setDeletingId(null)} className="text-white/30 hover:text-white/60 transition-colors">
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setDeletingId(job.id)} className="p-1.5 text-white/30 hover:text-red-400/70 transition-colors" title="Delete">
                          <Trash2 size={13} />
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
        <CareerFormModal
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
