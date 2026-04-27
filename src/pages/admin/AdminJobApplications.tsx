import { useState, useEffect } from 'react';
import { Download, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { JobPosting } from '@/types/career';

interface JobApplication {
  id: string;
  job_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  cover_letter: string | null;
  cv_url: string | null;
  submitted_at: string;
}

function exportCSV(applications: JobApplication[], jobTitle: string) {
  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'CV URL', 'Cover Letter', 'Submitted At'];
  const rows = applications.map(a => [
    a.first_name,
    a.last_name,
    a.email,
    a.phone ?? '',
    a.cv_url ?? '',
    a.cover_letter ?? '',
    new Date(a.submitted_at).toLocaleString(),
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${jobTitle.replace(/\s+/g, '-').toLowerCase()}-applications.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminJobApplications({ job, onBack }: { job: JobPosting; onBack: () => void }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', job.id)
      .order('submitted_at', { ascending: false })
      .then(({ data }) => {
        setApplications((data as JobApplication[]) ?? []);
        setLoading(false);
      });
  }, [job.id]);

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors mb-3"
          >
            <ArrowLeft size={12} /> Back to Careers
          </button>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Applications</p>
          <h1 className="text-[22px] font-semibold text-white">{job.title}</h1>
        </div>

        {applications.length > 0 && (
          <button
            onClick={() => exportCSV(applications, job.title)}
            className="flex items-center gap-2 border border-white/[0.08] px-4 py-2.5 text-[12px] text-white/50 hover:border-white/25 hover:text-white/80 transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        )}
      </div>

      {/* Stats row */}
      {!loading && applications.length > 0 && (
        <div className="flex gap-6 mb-6 pb-6 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 mb-1">Total</p>
            <p className="text-[24px] font-semibold text-white tabular-nums">{applications.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 mb-1">Latest</p>
            <p className="text-[13px] text-white/50 tabular-nums">
              {new Date(applications[0].submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-11 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <p className="text-white/20 text-[13px]">No applications for this role yet.</p>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-x-auto">
          <table className="w-full text-[12px] min-w-[640px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Name', 'Email', 'Phone', 'CV', 'Cover Letter', 'Submitted'].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                    {a.first_name} {a.last_name}
                  </td>
                  <td className="px-4 py-3 text-white/50">{a.email}</td>
                  <td className="px-4 py-3 text-white/35">{a.phone ?? <span className="text-white/15">—</span>}</td>
                  <td className="px-4 py-3">
                    {a.cv_url
                      ? <a href={a.cv_url} target="_blank" rel="noopener noreferrer" className="text-[12px] text-blue-400/70 hover:text-blue-300 transition-colors underline underline-offset-2">View PDF</a>
                      : <span className="text-white/15">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-white/35 max-w-[220px]">
                    {a.cover_letter
                      ? <span className="line-clamp-1">{a.cover_letter}</span>
                      : <span className="text-white/15">—</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-white/25 font-mono whitespace-nowrap">
                    {new Date(a.submitted_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
