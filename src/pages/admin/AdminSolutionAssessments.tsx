import { useState, useEffect } from 'react';
import { ClipboardList, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Toast } from './AdminFormUI';

// ── Types ────────────────────────────────────────────────────────────────────

interface SASubmission {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company: string | null;
  position: string | null;
  country: string | null;
  message: string | null;
  created_at: string;
}

interface ParsedMessage {
  background?: string;
  department?: string;
  company_website?: string;
  nomination_type?: string;
  num_users?: string;
  num_servers?: string;
  areas_of_interest?: string;
  how_soon?: string;
  ms_consent?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseMessage(msg: string | null): ParsedMessage {
  if (!msg) return {};
  const result: Record<string, string> = {};
  for (const line of msg.split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    if (key && val) result[key] = val;
  }
  return {
    background:       result['Background'],
    department:       result['Department'],
    company_website:  result['Company Website'],
    nomination_type:  result['Nomination Type'],
    num_users:        result['Number of Users'],
    num_servers:      result['Number of Servers'],
    areas_of_interest: result['Areas of Interest'],
    how_soon:         result['How Soon'],
    ms_consent:       result['Microsoft email consent'],
  };
}

// ── Detail expand ─────────────────────────────────────────────────────────────

function SADetail({ s }: { s: SASubmission }) {
  const parsed = parseMessage(s.message);

  const fields: { label: string; value?: string }[] = [
    { label: 'Position',         value: s.position ?? undefined },
    { label: 'Department',       value: parsed.department },
    { label: 'Country',          value: s.country ?? undefined },
    { label: 'Company Website',  value: parsed.company_website },
    { label: 'Nomination Type',  value: parsed.nomination_type },
    { label: 'No. of Users',     value: parsed.num_users },
    { label: 'No. of Servers',   value: parsed.num_servers },
    { label: 'How Soon',         value: parsed.how_soon },
    { label: 'MS Email Consent', value: parsed.ms_consent },
  ].filter(f => f.value);

  return (
    <tr>
      <td colSpan={6} className="bg-white/[0.02] border-b border-white/[0.04]">
        <div className="px-6 py-5">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-4 mb-4">
            {fields.map(f => (
              <div key={f.label}>
                <p className="text-[11px] uppercase tracking-[0.12em] text-white/25 mb-1">{f.label}</p>
                <p className="text-[14px] text-white/65">{f.value}</p>
              </div>
            ))}
          </div>

          {parsed.areas_of_interest && (
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/25 mb-1">Areas of Interest</p>
              <div className="flex flex-wrap gap-1.5">
                {parsed.areas_of_interest.split(', ').map(area => (
                  <span key={area} className="text-[11px] text-white/50 border border-white/[0.08] rounded-full px-2.5 py-0.5">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}

          {parsed.background && (
            <div>
              <p className="text-[11px] uppercase tracking-[0.12em] text-white/25 mb-1">Background</p>
              <p className="text-[14px] text-white/55 leading-relaxed max-w-2xl">{parsed.background}</p>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export function AdminSolutionAssessments() {
  const [submissions, setSubmissions] = useState<SASubmission[]>([]);
  const [loading, setLoading]         = useState(true);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [toast, setToast]             = useState<string | null>(null);

  function load() {
    setLoading(true);
    supabase
      .from('contact_submissions')
      .select('id, first_name, last_name, email, company, position, country, message, created_at')
      .eq('inquiry_type', 'solution-assessment')
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

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[24px] font-semibold text-white">Solution Assessments</h1>
        </div>
        <span className="text-[12px] text-white/25 tabular-nums">{submissions.length} total</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-white/[0.03] animate-pulse" />)}
        </div>
      ) : submissions.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <ClipboardList size={24} className="text-white/15 mx-auto mb-3" />
          <p className="text-white/20 text-[14px]">No assessment requests yet.</p>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-hidden">
          <table className="w-full text-[12px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Name', 'Company', 'Email', 'Country', 'Date', ''].map(h => (
                  <th key={h} className="text-left text-[11px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3.5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {submissions.map(s => (
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
                      {s.position && <span className="text-white/30 ml-2 text-[11px]">{s.position}</span>}
                    </td>
                    <td className="px-4 py-4 text-white/50">{s.company ?? '—'}</td>
                    <td className="px-4 py-4 text-white/45">{s.email}</td>
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
                  {expandedId === s.id && <SADetail key={`${s.id}-detail`} s={s} />}
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
