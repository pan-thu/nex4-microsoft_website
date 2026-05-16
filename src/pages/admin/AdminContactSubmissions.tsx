import { useState, useEffect } from 'react';
import { Mail, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Toast } from './AdminFormUI';

// ── Types ────────────────────────────────────────────────────────────────────

interface ContactSubmission {
  id: string;
  inquiry_type: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  position: string | null;
  country: string | null;
  city: string | null;
  message: string | null;
  how_heard: string | null;
  subscribed: boolean;
  created_at: string;
}

// ── Row detail expand ─────────────────────────────────────────────────────────

function SubmissionDetail({ s }: { s: ContactSubmission }) {
  return (
    <tr>
      <td colSpan={6} className="bg-white/[0.02] border-b border-white/[0.04]">
        <div className="px-6 py-5 grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4">
          {s.phone && (
            <Field label="Phone" value={s.phone} />
          )}
          {s.company && (
            <Field label="Company" value={s.company} />
          )}
          {s.position && (
            <Field label="Position" value={s.position} />
          )}
          {s.country && (
            <Field label="Country" value={`${s.country}${s.city ? `, ${s.city}` : ''}`} />
          )}
          {s.how_heard && (
            <Field label="How heard" value={s.how_heard} />
          )}
          <Field label="Newsletter" value={s.subscribed ? 'Yes' : 'No'} />
          {s.message && (
            <div className="col-span-2 lg:col-span-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/25 mb-1">Message</p>
              <p className="text-[14px] text-white/60 leading-relaxed">{s.message}</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.12em] text-white/25 mb-1">{label}</p>
      <p className="text-[14px] text-white/65">{value}</p>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export function AdminContactSubmissions() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [toast, setToast]             = useState<string | null>(null);
  const [filter, setFilter]           = useState<string>('');

  function load() {
    setLoading(true);
    supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setSubmissions(data ?? []);
        setLoading(false);
      });
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string) {
    await supabase.from('contact_submissions').delete().eq('id', id);
    setDeletingId(null);
    setExpandedId(null);
    load();
    setToast('Submission deleted.');
  }

  const filtered = filter
    ? submissions.filter(s =>
        s.inquiry_type === filter ||
        s.first_name.toLowerCase().includes(filter.toLowerCase()) ||
        s.last_name.toLowerCase().includes(filter.toLowerCase()) ||
        s.email.toLowerCase().includes(filter.toLowerCase())
      )
    : submissions;

  // Unique inquiry types for filter
  const inquiryTypes = [...new Set(submissions.map(s => s.inquiry_type))].sort();

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[24px] font-semibold text-white">Contact Submissions</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] text-white/25 tabular-nums">{submissions.length} total</span>
          {/* Filter by inquiry type */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] text-white text-[11px] px-3 py-2 outline-none"
          >
            <option value="">All types</option>
            {inquiryTypes.map(t => (
              <option key={t} value={t} className="bg-[#0e0e0e]">{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <Mail size={24} className="text-white/15 mx-auto mb-3" />
          <p className="text-white/20 text-[14px]">
            {submissions.length === 0 ? 'No submissions yet.' : 'No submissions match your filter.'}
          </p>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Name', 'Email', 'Inquiry', 'Country', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <>
                  <tr
                    key={s.id}
                    className={cn(
                      'border-b border-white/[0.04] transition-colors group cursor-pointer',
                      expandedId === s.id ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]',
                    )}
                    onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                  >
                    <td className="px-4 py-4">
                      <span className="text-white font-medium">{s.first_name} {s.last_name}</span>
                      {s.company && <span className="text-white/30 ml-2 text-[12px]">{s.company}</span>}
                    </td>
                    <td className="px-4 py-4 text-white/50">{s.email}</td>
                    <td className="px-4 py-4">
                      <span className="text-white/40 text-[12px] px-2 py-1 border border-white/[0.08] rounded-full whitespace-nowrap">
                        {s.inquiry_type}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-white/35">{s.country ?? '—'}</td>
                    <td className="px-4 py-4 text-white/25 font-mono whitespace-nowrap">
                      {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4">
                      <div className={cn('flex items-center gap-1 justify-end', deletingId === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')}>
                        {expandedId === s.id
                          ? <ChevronUp size={15} className="text-white/30 mr-1" />
                          : <ChevronDown size={15} className="text-white/30 mr-1" />
                        }
                        {deletingId === s.id ? (
                          <span className="flex items-center gap-1.5 text-[12px]">
                            <button
                              onClick={e => { e.stopPropagation(); handleDelete(s.id); }}
                              className="text-red-400 hover:text-red-300 font-medium transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setDeletingId(null); }}
                              className="text-white/30 hover:text-white/60 transition-colors"
                            >
                              Cancel
                            </button>
                          </span>
                        ) : (
                          <button
                            onClick={e => { e.stopPropagation(); setDeletingId(s.id); }}
                            className="p-1.5 text-white/30 hover:text-red-400/70 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedId === s.id && <SubmissionDetail key={`${s.id}-detail`} s={s} />}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && <Toast message={toast} onDone={() => setToast(null)} />}
    </>
  );
}
