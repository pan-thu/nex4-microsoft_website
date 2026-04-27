import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Link2 } from 'lucide-react';
import { NewsService } from '@/services/BlogService';
import { NEWS_CATEGORIES } from '@/lib/blogConstants';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  toSlug, estimateReadingTime, FieldLabel, FormInput, FormSelect, FormSection,
  AutoTextarea, SlugField, ImageUploadField,
  Toast, useKeyboardShortcuts,
} from './AdminFormUI';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import type { NewsArticle } from '@/types/blog';

// ── Types ────────────────────────────────────────────────────────────────────

type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  hero_image_url: string;
  category: string;
  reading_time: string;
  published_at: string;
  author_name: string;
  author_title: string;
  author_avatar_url: string;
};

const EMPTY_FORM: FormState = {
  title:             '',
  slug:              '',
  excerpt:           '',
  content:           '',
  hero_image_url:    '',
  category:          'company',
  reading_time:      '',
  published_at:      new Date().toISOString().slice(0, 16),
  author_name:       '',
  author_title:      '',
  author_avatar_url: '',
};

// ── NewsForm modal ───────────────────────────────────────────────────────────

function NewsFormModal({
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
  const [uploading, setUploading]       = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, true>>>({});

  function field<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
    if (key in errors) setErrors(prev => { const next = { ...prev }; delete next[key as keyof typeof next]; return next; });
  }

  function validate() {
    const e: typeof errors = {};
    if (!form.title.trim()) e.title = true;
    if (!form.slug.trim())  e.slug  = true;
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
      const path = `news/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(path, file);
      if (uploadError) throw uploadError;
      const url = supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
      setForm(f => ({ ...f, hero_image_url: url }));
    } catch { setError('Image upload failed.'); }
    finally { setUploading(false); }
  }

  async function handleAvatarUpload(file: File) {
    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `news/avatars/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('assets').upload(path, file);
      if (uploadError) throw uploadError;
      const url = supabase.storage.from('assets').getPublicUrl(path).data.publicUrl;
      setForm(f => ({ ...f, author_avatar_url: url }));
    } catch { setError('Avatar upload failed.'); }
    finally { setUploadingAvatar(false); }
  }

  const { minutes } = estimateReadingTime(form.content);

  useKeyboardShortcuts({ onClose, onSave: handleSave });

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-4 border-b border-white/[0.07] shrink-0 bg-[#0a0a0a]">
        <div>
          <h2 className="text-[17px] font-semibold text-white">
            {editingId ? 'Edit Article' : 'New Article'}
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
            {saving ? 'Saving…' : editingId ? 'Save changes' : 'Create article'}
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
              <FieldLabel>Excerpt</FieldLabel>
              <AutoTextarea
                value={form.excerpt}
                onChange={v => field('excerpt', v)}
                maxChars={300}
                minRows={2}
              />
            </div>
          </FormSection>

          <FormSection title="Content">
            <div>
              <div className="flex items-center justify-between mb-2">
                <FieldLabel>Body</FieldLabel>
                {form.content && (
                  <span className="text-[10px] text-white/20">
                    ~{minutes} min read
                  </span>
                )}
              </div>
              <RichTextEditor
                value={form.content}
                onChange={v => field('content', v)}
                placeholder="Start writing your article…"
                minHeight={320}
              />
            </div>
          </FormSection>

          <FormSection title="Classification">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel required>Category</FieldLabel>
                <FormSelect
                  value={form.category}
                  onChange={v => field('category', v)}
                  options={NEWS_CATEGORIES}
                />
              </div>
              <div>
                <FieldLabel>
                  Reading Time (min)
                  {form.content && (
                    <button
                      type="button"
                      onClick={() => field('reading_time', String(minutes))}
                      className="ml-2 text-[9px] text-white/20 hover:text-white/50 transition-colors normal-case tracking-normal"
                    >
                      use {minutes} min
                    </button>
                  )}
                </FieldLabel>
                <FormInput
                  type="number"
                  value={form.reading_time}
                  onChange={v => field('reading_time', v)}
                  placeholder={String(minutes)}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Published At</FieldLabel>
              <FormInput
                type="datetime-local"
                value={form.published_at}
                onChange={v => field('published_at', v)}
              />
            </div>
          </FormSection>

          <FormSection title="Author">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Author Name</FieldLabel>
                <FormInput
                  value={form.author_name}
                  onChange={v => field('author_name', v)}
                  placeholder="e.g. NEX4 Editorial Team"
                />
              </div>
              <div>
                <FieldLabel>Author Title / Role</FieldLabel>
                <FormInput
                  value={form.author_title}
                  onChange={v => field('author_title', v)}
                  placeholder="e.g. Cloud Practice Lead"
                />
              </div>
            </div>
            <div>
              <FieldLabel>Author Avatar</FieldLabel>
              <ImageUploadField
                value={form.author_avatar_url}
                onChange={v => field('author_avatar_url', v)}
                onUpload={handleAvatarUpload}
                uploading={uploadingAvatar}
                variant="avatar"
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

          {error && <p className="text-[13px] text-red-400/70">{error}</p>}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

const CATEGORY_STYLE: Record<string, string> = {
  company:     'bg-blue-500/10 text-blue-400 border-blue-500/20',
  partnership: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  product:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  industry:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  awards:      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
};

export function AdminNews() {
  const [articles, setArticles]     = useState<NewsArticle[]>([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState<FormState>(EMPTY_FORM);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast]           = useState<string | null>(null);

  function loadArticles() {
    setLoading(true);
    NewsService.getArticles().then(setArticles).finally(() => setLoading(false));
  }

  useEffect(() => { loadArticles(); }, []);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(article: NewsArticle) {
    setForm({
      title:             article.title,
      slug:              article.slug,
      excerpt:           article.excerpt ?? '',
      content:           article.content ?? '',
      hero_image_url:    article.hero_image_url ?? '',
      category:          article.category,
      reading_time:      article.reading_time?.toString() ?? '',
      published_at:      article.published_at.slice(0, 16),
      author_name:       article.author_name ?? '',
      author_title:      article.author_title ?? '',
      author_avatar_url: article.author_avatar_url ?? '',
    });
    setEditingId(article.id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    await supabase.from('news_articles').delete().eq('id', id);
    setDeletingId(null);
    loadArticles();
  }

  async function handleSave() {
    const payload = {
      title:             form.title,
      slug:              form.slug,
      excerpt:           form.excerpt || null,
      content:           form.content || null,
      hero_image_url:    form.hero_image_url || null,
      category:          form.category,
      reading_time:      form.reading_time ? parseInt(form.reading_time) : null,
      published_at:      form.published_at || new Date().toISOString(),
      author_name:       form.author_name || null,
      author_title:      form.author_title || null,
      author_avatar_url: form.author_avatar_url || null,
    };

    if (editingId) {
      const { error } = await supabase.from('news_articles').update(payload).eq('id', editingId);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from('news_articles').insert(payload);
      if (error) throw new Error(error.message);
    }
    setShowForm(false);
    loadArticles();
    setToast('Article saved successfully.');
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[24px] font-semibold text-white">News Articles</h1>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-white text-black text-[13px] font-semibold px-5 py-2.5 hover:bg-white/90 transition-colors"
        >
          <Plus size={15} /> New Article
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <p className="text-white/20 text-[13px] mb-3">No news articles yet.</p>
          <button onClick={openCreate} className="text-[11px] text-white/35 hover:text-white/60 transition-colors underline">
            Create your first article
          </button>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Title', 'Category', 'Published', ''].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.map(article => (
                <tr key={article.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      {article.hero_image_url && (
                        <img src={article.hero_image_url} alt="" className="w-8 h-8 object-cover border border-white/[0.06] shrink-0" />
                      )}
                      <span className="text-white font-medium truncate max-w-[280px]">{article.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={cn('text-[10px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 border', CATEGORY_STYLE[article.category] ?? 'bg-white/[0.05] text-white/40 border-white/10')}>
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-white/30 font-mono whitespace-nowrap">
                    {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className={cn('flex gap-1 justify-end transition-opacity', deletingId === article.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                      <a href={`/news/${article.slug}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="View">
                        <Link2 size={15} />
                      </a>
                      <button onClick={() => openEdit(article)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors" title="Edit">
                        <Pencil size={15} />
                      </button>
                      {deletingId === article.id ? (
                        <span className="flex items-center gap-1.5 ml-1 text-[13px]">
                          <button onClick={() => handleDelete(article.id)} className="text-red-400 hover:text-red-300 font-medium transition-colors">
                            Confirm
                          </button>
                          <button onClick={() => setDeletingId(null)} className="text-white/30 hover:text-white/60 transition-colors">
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <button onClick={() => setDeletingId(article.id)} className="p-1.5 text-white/30 hover:text-red-400/70 transition-colors" title="Delete">
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
        <NewsFormModal
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
