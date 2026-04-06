import { Routes, Route, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { Calendar, LogOut, ExternalLink, BookOpen, Newspaper, Briefcase, Mail } from 'lucide-react';
import { Auth } from '@/lib/auth';
import { ASSETS } from '@/lib/assets';
import { cn } from '@/lib/utils';
import { AdminEvents } from './AdminEvents';
import { AdminBlog } from './AdminBlog';
import { AdminNews } from './AdminNews';
import { AdminCareers } from './AdminCareers';
import { AdminContactSubmissions } from './AdminContactSubmissions';

const NAV = [
  { to: 'events',   label: 'Events',   icon: Calendar },
  { to: 'blog',     label: 'Blog',     icon: BookOpen },
  { to: 'news',     label: 'News',     icon: Newspaper },
  { to: 'careers',  label: 'Careers',  icon: Briefcase },
  { to: 'contacts', label: 'Contacts', icon: Mail },
];

export function AdminDashboard() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await Auth.signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-30 h-[56px] border-b border-white/[0.06] bg-[#080808]/95 backdrop-blur-md flex items-center px-6 justify-between">
        <div className="flex items-center gap-4">
          <img src={ASSETS.logo} alt="NEX4" className="h-7 w-auto object-contain" />
          <div className="w-px h-4 bg-white/[0.08]" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-semibold">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/events"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            View site <ExternalLink size={11} />
          </a>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 text-[11px] text-white/30 hover:text-white/60 transition-colors"
          >
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 pt-[56px]">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 border-r border-white/[0.06] flex flex-col pt-8 px-3 pb-6 fixed top-[56px] bottom-0">
          <nav className="flex flex-col gap-0.5">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={`/admin/${to}`}
                className={({ isActive }) => cn(
                  'flex items-center gap-2.5 px-3 py-2.5 text-[12px] font-medium rounded transition-colors duration-150',
                  isActive
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/35 hover:text-white/65 hover:bg-white/[0.04]',
                )}
              >
                <Icon size={14} />
                {label}
              </NavLink>
            ))}
          </nav>
          <p className="mt-auto px-1 text-[10px] text-white/15 leading-relaxed">
            © {new Date().getFullYear()} NEX4 ICT Solutions.<br />All rights reserved.
          </p>
        </aside>

        {/* Content */}
        <main className="flex-1 ml-52 px-10 py-10 min-h-full">
          <Routes>
            <Route index element={<Navigate to="events" replace />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="contacts" element={<AdminContactSubmissions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
