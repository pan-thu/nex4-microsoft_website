import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { Upload, Plus, Trash2, RefreshCw, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Helpers ───────────────────────────────────────────────────────────────────

export function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function estimateReadingTime(content: string) {
  const plain = content.replace(/<[^>]*>/g, ' ');
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  return { words, minutes: Math.max(1, Math.round(words / 200)) };
}

// ── Field primitives ──────────────────────────────────────────────────────────

export function FieldLabel({
  children,
  required,
  error,
}: {
  children: React.ReactNode;
  required?: boolean;
  error?: boolean;
}) {
  return (
    <label className={cn(
      'block text-[12px] uppercase tracking-[0.15em] font-medium mb-2 transition-colors',
      error ? 'text-red-400/80' : 'text-white/30',
    )}>
      {children}
      {required && <span className="ml-0.5 text-white/15">*</span>}
    </label>
  );
}

const inputBase =
  'w-full bg-white/[0.04] border px-3 py-3 text-white text-[14px] outline-none transition-colors placeholder:text-white/15';

export function FormInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  className,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      className={cn(
        inputBase,
        error
          ? 'border-red-500/40 focus:border-red-500/60'
          : 'border-white/[0.08] focus:border-white/25',
        className,
      )}
    />
  );
}

export function FormSelect({
  value,
  onChange,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: boolean;
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className={cn(
        'w-full bg-[#111] border px-3 py-3 text-white text-[14px] outline-none transition-colors',
        error
          ? 'border-red-500/40 focus:border-red-500/60'
          : 'border-white/[0.08] focus:border-white/25',
      )}
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

export function AutoTextarea({
  value,
  onChange,
  placeholder,
  minRows = 3,
  maxChars,
  mono,
  error,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minRows?: number;
  maxChars?: number;
  mono?: boolean;
  error?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const pct = maxChars ? value.length / maxChars : 0;

  return (
    <div>
      <textarea
        ref={ref}
        value={value}
        placeholder={placeholder}
        rows={minRows}
        onChange={e => onChange(e.target.value)}
        style={{ overflow: 'hidden' }}
        className={cn(
          inputBase,
          'resize-y',
          mono && 'font-mono',
          error
            ? 'border-red-500/40 focus:border-red-500/60'
            : 'border-white/[0.08] focus:border-white/25',
          className,
        )}
      />
      {maxChars && (
        <p className={cn(
          'mt-1 text-[10px] text-right transition-colors',
          pct >= 1 ? 'text-red-400/60' : pct >= 0.8 ? 'text-amber-400/60' : 'text-white/20',
        )}>
          {value.length} / {maxChars}
        </p>
      )}
    </div>
  );
}

// ── FormSection ───────────────────────────────────────────────────────────────

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/20 font-semibold whitespace-nowrap">{title}</p>
        <div className="flex-1 h-px bg-white/[0.05]" />
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

// ── SlugField ─────────────────────────────────────────────────────────────────

export function SlugField({
  value,
  onChange,
  editingId,
  onRegenerate,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  editingId: string | null;
  onRegenerate: () => void;
  error?: boolean;
}) {
  return (
    <div className="relative">
      <FormInput value={value} onChange={onChange} error={error} />
      {editingId && (
        <button
          type="button"
          onClick={onRegenerate}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-white/25 hover:text-white/55 transition-colors"
        >
          <RefreshCw size={10} /> Regenerate
        </button>
      )}
    </div>
  );
}

// ── ImageUploadField ──────────────────────────────────────────────────────────

export function ImageUploadField({
  value,
  onChange,
  onUpload,
  uploading,
  variant = 'image',
}: {
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<void>;
  uploading: boolean;
  variant?: 'image' | 'avatar';
}) {
  return (
    <div>
      {variant === 'avatar' ? (
        <div className="flex items-center gap-4">
          {value && (
            <div className="relative shrink-0 group">
              <img src={value} alt="preview" className="w-14 h-14 rounded-full object-cover border border-white/[0.12]" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/80 border border-white/10 text-white/50 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={9} />
              </button>
            </div>
          )}
          <label className={cn(
            'flex items-center gap-2 px-4 py-2 border border-white/[0.08] text-[12px] text-white/40 cursor-pointer hover:border-white/25 hover:text-white/70 transition-colors',
            uploading && 'opacity-50 pointer-events-none',
          )}>
            {uploading ? <span className="animate-pulse">Uploading…</span> : <><Upload size={13} /> {value ? 'Change photo' : 'Upload photo'}</>}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <>
          <label className={cn(
            'flex items-center gap-2 px-4 py-2.5 border border-dashed border-white/[0.08] text-[12px] text-white/40 cursor-pointer hover:border-white/25 hover:text-white/70 transition-colors w-full justify-center',
            uploading && 'opacity-50 pointer-events-none',
          )}>
            {uploading ? <span className="animate-pulse">Uploading…</span> : <><Upload size={13} /> {value ? 'Replace image' : 'Upload image'}</>}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => e.target.files?.[0] && onUpload(e.target.files[0])}
            />
          </label>
          {value && (
            <div className="mt-2 relative h-28 overflow-hidden border border-white/[0.06] group">
              <img src={value} alt="preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute top-2 right-2 p-1 bg-black/60 text-white/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── TagsInput ─────────────────────────────────────────────────────────────────

export function TagsInput({ tags, onChange }: { tags: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('');

  function addTag(raw: string) {
    const val = raw.trim().replace(/,$/, '').trim();
    if (val && !tags.includes(val)) onChange([...tags, val]);
    setInput('');
  }

  function removeTag(i: number) {
    onChange(tags.filter((_, idx) => idx !== i));
  }

  return (
    <div className={cn(
      'flex flex-wrap gap-1.5 min-h-[42px] p-2 border border-white/[0.08] bg-white/[0.04] focus-within:border-white/25 transition-colors',
    )}>
      {tags.map((t, i) => (
        <span key={i} className="flex items-center gap-1 bg-white/[0.08] text-white/60 text-[13px] px-2 py-0.5 rounded-sm">
          {t}
          <button type="button" onClick={() => removeTag(i)} className="text-white/30 hover:text-white/70 transition-colors leading-none">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(input); }
          if (e.key === 'Backspace' && !input && tags.length > 0) removeTag(tags.length - 1);
        }}
        onBlur={() => input && addTag(input)}
        placeholder={tags.length === 0 ? 'Type a tag and press Enter…' : ''}
        className="flex-1 min-w-[120px] bg-transparent text-white text-[12px] outline-none placeholder:text-white/15"
      />
    </div>
  );
}

// ── TakeawayEditor ────────────────────────────────────────────────────────────

export type TakeawayItem = { icon: string; text: string };

const TAKEAWAY_ICONS = ['brain', 'rocket', 'fingerprint', 'check', 'zap', 'shield', 'cloud', 'bot'];

export function TakeawayEditor({
  items,
  onChange,
}: {
  items: TakeawayItem[];
  onChange: (items: TakeawayItem[]) => void;
}) {
  function add() { onChange([...items, { icon: 'check', text: '' }]); }
  function remove(i: number) { onChange(items.filter((_, idx) => idx !== i)); }
  function update(i: number, field: keyof TakeawayItem, val: string) {
    onChange(items.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2 items-center">
          <select
            value={item.icon}
            onChange={e => update(i, 'icon', e.target.value)}
            className="w-28 shrink-0 bg-[#111] border border-white/[0.08] px-2 py-2 text-white text-[12px] outline-none focus:border-white/25 transition-colors"
          >
            {TAKEAWAY_ICONS.map(icon => <option key={icon} value={icon}>{icon}</option>)}
          </select>
          <input
            value={item.text}
            onChange={e => update(i, 'text', e.target.value)}
            placeholder="Takeaway text…"
            className="flex-1 bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-white text-[12px] outline-none focus:border-white/25 transition-colors placeholder:text-white/15"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="shrink-0 p-2 text-white/25 hover:text-red-400/70 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors self-start mt-1"
      >
        <Plus size={12} /> Add takeaway
      </button>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 bg-[#111] border border-emerald-500/25 text-white text-[12px] px-4 py-3 shadow-xl">
      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
      {message}
    </div>
  );
}

// ── Keyboard shortcuts ────────────────────────────────────────────────────────

export function useKeyboardShortcuts(
  handlers: { onClose: () => void; onSave: () => void },
) {
  const ref = useRef(handlers);
  useLayoutEffect(() => { ref.current = handlers; });

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') ref.current.onClose();
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) ref.current.onSave();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
