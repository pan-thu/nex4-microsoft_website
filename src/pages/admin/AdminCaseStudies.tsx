import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Link2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  toSlug, FieldLabel, FormInput, FormSelect, FormSection,
  AutoTextarea, SlugField, ImageUploadField,
  TagsInput, Toast, useKeyboardShortcuts,
} from './AdminFormUI';
import type { CaseStudyRow, CaseStudyCategory } from '@/types/caseStudy';

// ── Types ────────────────────────────────────────────────────────────────────

type ApproachStep = { title: string; body: string };
type ResultItem   = { value: string; suffix: string; label: string };

const CATEGORIES: { value: CaseStudyCategory; label: string }[] = [
  { value: 'workplace-productivity', label: 'Workplace Productivity' },
  { value: 'workplace-security',     label: 'Workplace Security' },
  { value: 'workplace-ai',           label: 'Workplace AI' },
  { value: 'workplace-automation',   label: 'Workplace Automation' },
  { value: 'workplace-backup',       label: 'Workplace Backup' },
  { value: 'cloud-migration',        label: 'Cloud Migration' },
];

const CATEGORY_OPTIONS = CATEGORIES.map(c => ({ value: c.value, label: c.label }));

type FormState = {
  slug: string;
  client: string;
  industry: string;
  category: string;
  title: string;
  excerpt: string;
  image_url: string;
  challenge: string;
  approach_intro: string;
  approach: ApproachStep[];
  technologies: string[];
  results_intro: string;
  results: ResultItem[];
  has_testimonial: boolean;
  testimonial_quote: string;
  testimonial_name: string;
  testimonial_title: string;
  related_service_title: string;
  related_service_slug: string;
};

const EMPTY_FORM: FormState = {
  slug:                  '',
  client:                '',
  industry:              '',
  category:              'workplace-productivity',
  title:                 '',
  excerpt:               '',
  image_url:             '',
  challenge:             '',
  approach_intro:        '',
  approach:              [{ title: '', body: '' }],
  technologies:          [],
  results_intro:         '',
  results:               [{ value: '', suffix: '', label: '' }],
  has_testimonial:       false,
  testimonial_quote:     '',
  testimonial_name:      '',
  testimonial_title:     '',
  related_service_title: '',
  related_service_slug:  '',
};

// ── Approach step editor ──────────────────────────────────────────────────────

function ApproachEditor({
  steps,
  onChange,
}: {
  steps: ApproachStep[];
  onChange: (steps: ApproachStep[]) => void;
}) {
  function update(i: number, key: keyof ApproachStep, val: string) {
    const next = steps.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
    onChange(next);
  }
  function add() { onChange([...steps, { title: '', body: '' }]); }
  function remove(i: number) { onChange(steps.filter((_, idx) => idx !== i)); }
  function move(i: number, dir: -1 | 1) {
    const next = [...steps];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, i) => (
        <div key={i} className="border border-white/[0.07] p-4 flex flex-col gap-3 relative">
          {/* Step number + move controls */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-[0.15em] text-white/20 font-semibold">Step {i + 1}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="p-1 text-white/20 hover:text-white/50 disabled:opacity-20 transition-colors"
              >
                <ChevronUp size={13} />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === steps.length - 1}
                className="p-1 text-white/20 hover:text-white/50 disabled:opacity-20 transition-colors"
              >
                <ChevronDown size={13} />
              </button>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 text-white/20 hover:text-red-400/60 transition-colors ml-1"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          <div>
            <FieldLabel>Title</FieldLabel>
            <FormInput value={step.title} onChange={v => update(i, 'title', v)} />
          </div>
          <div>
            <FieldLabel>Body</FieldLabel>
            <AutoTextarea value={step.body} onChange={v => update(i, 'body', v)} minRows={3} />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors border border-dashed border-white/[0.08] px-4 py-2.5 hover:border-white/20"
      >
        <Plus size={12} /> Add step
      </button>
    </div>
  );
}

// ── Results editor ────────────────────────────────────────────────────────────

function ResultsEditor({
  items,
  onChange,
}: {
  items: ResultItem[];
  onChange: (items: ResultItem[]) => void;
}) {
  function update(i: number, key: keyof ResultItem, val: string) {
    const next = items.map((r, idx) => idx === i ? { ...r, [key]: val } : r);
    onChange(next);
  }
  function add() { onChange([...items, { value: '', suffix: '', label: '' }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-start">
          <div className="w-24 shrink-0">
            <FieldLabel>Value</FieldLabel>
            <FormInput value={item.value} onChange={v => update(i, 'value', v)} placeholder="99" />
          </div>
          <div className="w-20 shrink-0">
            <FieldLabel>Suffix</FieldLabel>
            <FormInput value={item.suffix} onChange={v => update(i, 'suffix', v)} placeholder="%" />
          </div>
          <div className="flex-1">
            <FieldLabel>Label</FieldLabel>
            <FormInput value={item.label} onChange={v => update(i, 'label', v)} placeholder="Description of result" />
          </div>
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-7 p-1.5 text-white/20 hover:text-red-400/60 transition-colors shrink-0"
            >
              <X size={13} />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors border border-dashed border-white/[0.08] px-4 py-2.5 hover:border-white/20 mt-1"
      >
        <Plus size={12} /> Add result
      </button>
    </div>
  );
}

// ── Form modal ────────────────────────────────────────────────────────────────

function CaseStudyFormModal({
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
    if (!form.slug.trim())   e.slug   = true;
    if (!form.client.trim()) e.client = true;
    if (!form.title.trim())  e.title  = true;
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
      const path = `case-studies/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(path, file);
      if (uploadError) throw uploadError;
      const url = supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
      setForm(f => ({ ...f, image_url: url }));
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
              {editingId ? 'Edit Case Study' : 'New Case Study'}
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required error={!!errors.client}>Client</FieldLabel>
                <FormInput
                  value={form.client}
                  error={!!errors.client}
                  onChange={v => field('client', v)}
                />
              </div>
              <div>
                <FieldLabel>Industry</FieldLabel>
                <FormInput
                  value={form.industry}
                  onChange={v => field('industry', v)}
                  placeholder="e.g. Financial Services"
                />
              </div>
            </div>
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
              <FieldLabel>Excerpt</FieldLabel>
              <AutoTextarea
                value={form.excerpt}
                onChange={v => field('excerpt', v)}
                maxChars={400}
                minRows={2}
              />
            </div>
            <div>
              <FieldLabel required>Category</FieldLabel>
              <FormSelect
                value={form.category}
                onChange={v => field('category', v)}
                options={CATEGORY_OPTIONS}
              />
            </div>
          </FormSection>

          <FormSection title="Challenge">
            <div>
              <FieldLabel>Challenge Description</FieldLabel>
              <AutoTextarea
                value={form.challenge}
                onChange={v => field('challenge', v)}
                minRows={4}
              />
            </div>
          </FormSection>

          <FormSection title="Approach">
            <div>
              <FieldLabel>Approach Introduction</FieldLabel>
              <AutoTextarea
                value={form.approach_intro}
                onChange={v => field('approach_intro', v)}
                minRows={2}
              />
            </div>
            <div>
              <FieldLabel>Steps</FieldLabel>
              <ApproachEditor
                steps={form.approach}
                onChange={steps => field('approach', steps)}
              />
            </div>
          </FormSection>

          <FormSection title="Technologies">
            <div>
              <FieldLabel>Technologies Used</FieldLabel>
              <TagsInput
                tags={form.technologies}
                onChange={tags => field('technologies', tags)}
              />
            </div>
          </FormSection>

          <FormSection title="Results">
            <div>
              <FieldLabel>Results Introduction</FieldLabel>
              <AutoTextarea
                value={form.results_intro}
                onChange={v => field('results_intro', v)}
                minRows={2}
              />
            </div>
            <div>
              <FieldLabel>Result Stats</FieldLabel>
              <ResultsEditor
                items={form.results}
                onChange={items => field('results', items)}
              />
            </div>
          </FormSection>

          <FormSection title="Testimonial">
            <div className="flex items-center gap-3 mb-4">
              <button
                type="button"
                onClick={() => field('has_testimonial', !form.has_testimonial)}
                className={cn(
                  'relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0',
                  form.has_testimonial ? 'bg-white' : 'bg-white/10',
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform duration-200',
                    form.has_testimonial ? 'bg-black translate-x-4' : 'bg-white/40',
                  )}
                />
              </button>
              <span className="text-[12px] text-white/40">Include testimonial</span>
            </div>
            {form.has_testimonial && (
              <div className="flex flex-col gap-4">
                <div>
                  <FieldLabel>Quote</FieldLabel>
                  <AutoTextarea
                    value={form.testimonial_quote}
                    onChange={v => field('testimonial_quote', v)}
                    minRows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Name / Role</FieldLabel>
                    <FormInput
                      value={form.testimonial_name}
                      onChange={v => field('testimonial_name', v)}
                      placeholder="e.g. Chief Technology Officer"
                    />
                  </div>
                  <div>
                    <FieldLabel>Company</FieldLabel>
                    <FormInput
                      value={form.testimonial_title}
                      onChange={v => field('testimonial_title', v)}
                      placeholder="e.g. Myanmar Banking Corp"
                    />
                  </div>
                </div>
              </div>
            )}
          </FormSection>

          <FormSection title="Related Service">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Service Title</FieldLabel>
                <FormInput
                  value={form.related_service_title}
                  onChange={v => field('related_service_title', v)}
                  placeholder="e.g. Workplace Security"
                />
              </div>
              <div>
                <FieldLabel>Service Slug</FieldLabel>
                <FormInput
                  value={form.related_service_slug}
                  onChange={v => field('related_service_slug', v)}
                  placeholder="e.g. workplace-security"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Media">
            <div>
              <FieldLabel>Hero Image</FieldLabel>
              <ImageUploadField
                value={form.image_url}
                onChange={v => field('image_url', v)}
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
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create case study'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  'workplace-productivity': 'Productivity',
  'workplace-security':     'Security',
  'workplace-ai':           'AI',
  'workplace-automation':   'Automation',
  'workplace-backup':       'Backup',
  'cloud-migration':        'Cloud',
};

const CATEGORY_STYLE: Record<string, string> = {
  'workplace-productivity': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'workplace-security':     'bg-red-500/10 text-red-400 border-red-500/20',
  'workplace-ai':           'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'workplace-automation':   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'workplace-backup':       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'cloud-migration':        'bg-sky-500/10 text-sky-400 border-sky-500/20',
};

function rowToForm(row: CaseStudyRow): FormState {
  const testimonial = row.testimonial as { quote: string; name: string; title: string } | null;
  const relatedService = row.related_service as { title: string; slug: string } | null;
  const approach = (row.approach as Array<{ title: string; body: string }>) ?? [];
  const results  = (row.results  as Array<{ value: string; suffix?: string; label: string }>) ?? [];

  return {
    slug:                  row.slug,
    client:                row.client,
    industry:              row.industry ?? '',
    category:              row.category,
    title:                 row.title,
    excerpt:               row.excerpt ?? '',
    image_url:             row.image_url ?? '',
    challenge:             row.challenge ?? '',
    approach_intro:        row.approach_intro ?? '',
    approach:              approach.length ? approach : [{ title: '', body: '' }],
    technologies:          row.technologies ?? [],
    results_intro:         row.results_intro ?? '',
    results:               results.length ? results.map(r => ({ ...r, suffix: r.suffix ?? '' })) : [{ value: '', suffix: '', label: '' }],
    has_testimonial:       !!testimonial,
    testimonial_quote:     testimonial?.quote ?? '',
    testimonial_name:      testimonial?.name  ?? '',
    testimonial_title:     testimonial?.title ?? '',
    related_service_title: relatedService?.title ?? '',
    related_service_slug:  relatedService?.slug  ?? '',
  };
}

export function AdminCaseStudies() {
  const [rows, setRows]           = useState<CaseStudyRow[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showForm, setShowForm]   = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);

  function load() {
    setLoading(true);
    supabase
      .from('case_studies')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRows((data as CaseStudyRow[]) ?? []);
        setLoading(false);
      });
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(row: CaseStudyRow) {
    setForm(rowToForm(row));
    setEditingId(row.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    await supabase.from('case_studies').delete().eq('id', id);
    setDeletingId(null);
    load();
    setToast('Case study deleted.');
  }

  async function handleSave() {
    const approach = form.approach.filter(s => s.title.trim() || s.body.trim());
    const results  = form.results.filter(r => r.value.trim() || r.label.trim()).map(r => ({
      value: r.value,
      ...(r.suffix ? { suffix: r.suffix } : {}),
      label: r.label,
    }));

    const payload = {
      slug:            form.slug,
      client:          form.client,
      industry:        form.industry || null,
      category:        form.category,
      title:           form.title,
      excerpt:         form.excerpt || null,
      image_url:       form.image_url || null,
      challenge:       form.challenge || null,
      approach_intro:  form.approach_intro || null,
      approach:        approach,
      technologies:    form.technologies,
      results_intro:   form.results_intro || null,
      results:         results,
      testimonial:     form.has_testimonial && form.testimonial_quote
        ? { quote: form.testimonial_quote, name: form.testimonial_name, title: form.testimonial_title }
        : null,
      related_service: form.related_service_title
        ? { title: form.related_service_title, slug: form.related_service_slug }
        : null,
    };

    if (editingId) {
      const { error } = await supabase.from('case_studies').update(payload).eq('id', editingId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('case_studies').insert(payload);
      if (error) throw new Error(error.message);
    }
    setShowForm(false);
    load();
    setToast('Case study saved.');
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[22px] font-semibold text-white">Case Studies</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-white text-black text-[12px] font-semibold px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          <Plus size={14} /> New Case Study
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : rows.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <p className="text-white/20 text-[13px] mb-3">No case studies yet.</p>
          <button onClick={openCreate} className="text-[11px] text-white/35 hover:text-white/60 transition-colors underline">
            Create the first one
          </button>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Client', 'Title', 'Category', ''].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {row.image_url && (
                        <img src={row.image_url} alt="" className="w-8 h-8 object-cover border border-white/[0.06] shrink-0 rounded" />
                      )}
                      <div>
                        <p className="text-white font-medium">{row.client}</p>
                        {row.industry && <p className="text-white/30 text-[11px]">{row.industry}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-white/55 max-w-[280px]">
                    <span className="line-clamp-1">{row.title}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 border',
                      CATEGORY_STYLE[row.category] ?? 'bg-white/[0.05] text-white/40 border-white/10',
                    )}>
                      {CATEGORY_LABEL[row.category] ?? row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className={cn('flex gap-1 justify-end transition-opacity', deletingId === row.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                      <a
                        href={`/case-studies/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors"
                        title="View"
                      >
                        <Link2 size={13} />
                      </a>
                      <button
                        onClick={() => openEdit(row)}
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={13} />
                      </button>
                      {deletingId === row.id ? (
                        <span className="flex items-center gap-1.5 ml-1 text-[11px]">
                          <button
                            onClick={() => handleDelete(row.id)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="text-white/30 hover:text-white/60 transition-colors"
                          >
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setDeletingId(row.id)}
                          className="p-1.5 text-white/30 hover:text-red-400/70 transition-colors"
                          title="Delete"
                        >
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
        <CaseStudyFormModal
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
