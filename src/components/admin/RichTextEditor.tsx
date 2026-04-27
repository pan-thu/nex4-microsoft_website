import { useEffect, useRef, useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Link2, Image as ImageIcon,
  Palette, Eraser, Undo2, Redo2, Heading1, Heading2, Heading3,
  Pilcrow, X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Toolbar button ────────────────────────────────────────────────────────────

function Btn({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      className={cn(
        'w-7 h-7 flex items-center justify-center rounded transition-colors duration-100',
        active
          ? 'bg-white text-black'
          : 'text-white/50 hover:text-white hover:bg-white/[0.08]',
        disabled && 'opacity-25 pointer-events-none',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-white/[0.10] mx-0.5" />;
}

// ── Link dialog ───────────────────────────────────────────────────────────────

function LinkDialog({
  initial,
  onConfirm,
  onClose,
}: {
  initial: string;
  onConfirm: (url: string) => void;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(initial);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 flex items-center gap-2 bg-[#1a1a1a] border border-white/[0.12] px-3 py-2.5 shadow-xl w-72">
      <Link2 size={13} className="text-white/40 shrink-0" />
      <input
        ref={ref}
        type="url"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://…"
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); onConfirm(url); }
          if (e.key === 'Escape') { e.preventDefault(); onClose(); }
        }}
        className="flex-1 bg-transparent text-white text-[12px] outline-none placeholder:text-white/20"
      />
      <button type="button" onClick={() => onConfirm(url)}
        className="shrink-0 px-2 py-0.5 bg-white text-black text-[11px] font-semibold hover:bg-white/90">
        Set
      </button>
      <button type="button" onClick={onClose} className="shrink-0 text-white/30 hover:text-white/70">
        <X size={12} />
      </button>
    </div>
  );
}

// ── Image dialog ──────────────────────────────────────────────────────────────

function ImageDialog({
  onConfirm,
  onClose,
}: {
  onConfirm: (src: string, alt: string) => void;
  onClose: () => void;
}) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 flex flex-col gap-2 bg-[#1a1a1a] border border-white/[0.12] px-3 py-3 shadow-xl w-72">
      <div className="flex items-center gap-2">
        <ImageIcon size={13} className="text-white/40 shrink-0" />
        <input
          ref={ref}
          type="url"
          value={src}
          onChange={e => setSrc(e.target.value)}
          placeholder="Image URL…"
          onKeyDown={e => { if (e.key === 'Enter' && src) { e.preventDefault(); onConfirm(src, alt); } if (e.key === 'Escape') onClose(); }}
          className="flex-1 bg-transparent text-white text-[12px] outline-none placeholder:text-white/20"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="w-[13px]" />
        <input
          type="text"
          value={alt}
          onChange={e => setAlt(e.target.value)}
          placeholder="Alt text (optional)"
          className="flex-1 bg-transparent text-white/70 text-[12px] outline-none placeholder:text-white/20 border-t border-white/[0.07] pt-1.5"
        />
      </div>
      <div className="flex justify-end gap-2 mt-1">
        <button type="button" onClick={onClose} className="text-[11px] text-white/30 hover:text-white/60">Cancel</button>
        <button type="button" disabled={!src} onClick={() => onConfirm(src, alt)}
          className="px-2 py-0.5 bg-white text-black text-[11px] font-semibold hover:bg-white/90 disabled:opacity-40">
          Insert
        </button>
      </div>
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  const [showLink, setShowLink]   = useState(false);
  const [showImage, setShowImage] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const setLink = useCallback((url: string) => {
    if (!editor) return;
    if (!url) { editor.chain().focus().unsetLink().run(); }
    else { editor.chain().focus().extendMarkRange('link').setLink({ href: url, target: '_blank' }).run(); }
    setShowLink(false);
  }, [editor]);

  const insertImage = useCallback((src: string, alt: string) => {
    if (!editor || !src) return;
    editor.chain().focus().setImage({ src, alt }).run();
    setShowImage(false);
  }, [editor]);

  if (!editor) return null;

  const currentLink = editor.getAttributes('link').href ?? '';

  return (
    <div
      ref={toolbarRef}
      className="relative flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-white/[0.07] bg-[#111] shrink-0 sticky top-0 z-10"
    >
      {/* Undo / Redo */}
      <Btn title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 size={13} />
      </Btn>
      <Btn title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 size={13} />
      </Btn>

      <Divider />

      {/* Headings */}
      <Btn title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
        <Pilcrow size={13} />
      </Btn>
      <Btn title="Heading 1" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
        <Heading1 size={14} />
      </Btn>
      <Btn title="Heading 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        <Heading2 size={14} />
      </Btn>
      <Btn title="Heading 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        <Heading3 size={14} />
      </Btn>

      <Divider />

      {/* Inline formatting */}
      <Btn title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={13} />
      </Btn>
      <Btn title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={13} />
      </Btn>
      <Btn title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={13} />
      </Btn>
      <Btn title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={13} />
      </Btn>

      <Divider />

      {/* Text color */}
      <div className="relative flex items-center">
        <label title="Text color" className="w-7 h-7 flex items-center justify-center rounded cursor-pointer text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors">
          <Palette size={13} />
          <input
            type="color"
            className="absolute opacity-0 w-0 h-0"
            onInput={e => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
          />
        </label>
      </div>

      <Divider />

      {/* Alignment */}
      <Btn title="Align left"   active={editor.isActive({ textAlign: 'left' })}   onClick={() => editor.chain().focus().setTextAlign('left').run()}>
        <AlignLeft size={13} />
      </Btn>
      <Btn title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
        <AlignCenter size={13} />
      </Btn>
      <Btn title="Align right"  active={editor.isActive({ textAlign: 'right' })}  onClick={() => editor.chain().focus().setTextAlign('right').run()}>
        <AlignRight size={13} />
      </Btn>

      <Divider />

      {/* Lists */}
      <Btn title="Bullet list"  active={editor.isActive('bulletList')}  onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={13} />
      </Btn>
      <Btn title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={13} />
      </Btn>

      <Divider />

      {/* Blockquote */}
      <Btn title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={13} />
      </Btn>

      <Divider />

      {/* Link */}
      <div className="relative">
        <Btn title="Insert link" active={editor.isActive('link')} onClick={() => { setShowImage(false); setShowLink(v => !v); }}>
          <Link2 size={13} />
        </Btn>
        {showLink && (
          <LinkDialog
            initial={currentLink}
            onConfirm={setLink}
            onClose={() => setShowLink(false)}
          />
        )}
      </div>

      {/* Image */}
      <div className="relative">
        <Btn title="Insert image" onClick={() => { setShowLink(false); setShowImage(v => !v); }}>
          <ImageIcon size={13} />
        </Btn>
        {showImage && (
          <ImageDialog onConfirm={insertImage} onClose={() => setShowImage(false)} />
        )}
      </div>

      <Divider />

      {/* Clear formatting */}
      <Btn title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}>
        <Eraser size={13} />
      </Btn>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({ value, onChange, placeholder = 'Start writing…', minHeight = 280 }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' } }),
      Image,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'rte-content outline-none',
      },
    },
  });

  // Sync external value changes (e.g. when form resets)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || '', false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="border border-white/[0.08] bg-[#0a0a0a] flex flex-col focus-within:border-white/25 transition-colors">
      <Toolbar editor={editor} />
      <div className="overflow-y-auto" style={{ minHeight }}>
        <EditorContent editor={editor} className="rte-wrapper" />
      </div>
    </div>
  );
}
