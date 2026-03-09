import { useState, useEffect } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { EventService } from '@/services/EventService';
import type { Event, Registration } from '@/types/events';

function exportCSV(registrations: Registration[], eventTitle: string) {
  const headers = ['First Name', 'Last Name', 'Email', 'Company', 'Job Title', 'Country', 'Registered At'];
  const rows = registrations.map(r => [
    r.first_name,
    r.last_name,
    r.email,
    r.company_name ?? '',
    r.job_title ?? '',
    r.country,
    new Date(r.registered_at).toLocaleString(),
  ]);
  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventTitle.replace(/\s+/g, '-').toLowerCase()}-registrations.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminRegistrations() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegs, setLoadingRegs] = useState(false);

  useEffect(() => {
    setLoadingEvents(true);
    EventService.getEvents().then(es => {
      setEvents(es);
      if (es.length > 0) setSelectedId(es[0].id);
    }).finally(() => setLoadingEvents(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingRegs(true);
    EventService.getRegistrations(selectedId)
      .then(setRegistrations)
      .finally(() => setLoadingRegs(false));
  }, [selectedId]);

  const selectedEvent = events.find(e => e.id === selectedId);

  return (
    <>
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold mb-1">Manage</p>
          <h1 className="text-[22px] font-semibold text-white">Registrations</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Event selector */}
          <div className="relative">
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              disabled={loadingEvents}
              className="appearance-none bg-white/[0.04] border border-white/[0.08] pl-3 pr-8 py-2.5 text-white text-[12px] outline-none focus:border-white/25 transition-colors disabled:opacity-40 cursor-pointer min-w-[220px]"
            >
              {events.map(e => (
                <option key={e.id} value={e.id}>{e.title}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
          </div>

          {/* Export button */}
          {registrations.length > 0 && selectedEvent && (
            <button
              onClick={() => exportCSV(registrations, selectedEvent.title)}
              className="flex items-center gap-2 border border-white/[0.08] px-4 py-2.5 text-[12px] text-white/50 hover:border-white/25 hover:text-white/80 transition-colors"
            >
              <Download size={13} /> Export CSV
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      {!loadingRegs && registrations.length > 0 && (
        <div className="flex gap-6 mb-6 pb-6 border-b border-white/[0.06]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 mb-1">Total</p>
            <p className="text-[24px] font-semibold text-white tabular-nums">{registrations.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 mb-1">Latest</p>
            <p className="text-[13px] text-white/50 tabular-nums">
              {new Date(registrations[0].registered_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      {loadingRegs ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-11 bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : registrations.length === 0 ? (
        <div className="py-20 text-center border border-white/[0.06]">
          <p className="text-white/20 text-[13px]">No registrations for this event yet.</p>
        </div>
      ) : (
        <div className="border border-white/[0.07] overflow-x-auto">
          <table className="w-full text-[12px] min-w-[700px]">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                {['Name', 'Email', 'Company', 'Job Title', 'Country', 'Registered'].map(h => (
                  <th key={h} className="text-left text-[10px] uppercase tracking-[0.15em] text-white/25 font-semibold px-4 py-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registrations.map(r => (
                <tr key={r.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 text-white font-medium whitespace-nowrap">
                    {r.first_name} {r.last_name}
                  </td>
                  <td className="px-4 py-3 text-white/50">{r.email}</td>
                  <td className="px-4 py-3 text-white/35">{r.company_name ?? <span className="text-white/15">—</span>}</td>
                  <td className="px-4 py-3 text-white/35">{r.job_title ?? <span className="text-white/15">—</span>}</td>
                  <td className="px-4 py-3 text-white/35">{r.country}</td>
                  <td className="px-4 py-3 text-white/25 font-mono whitespace-nowrap">
                    {new Date(r.registered_at).toLocaleDateString('en-US', {
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
