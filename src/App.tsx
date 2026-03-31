import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { BackToTop } from '@/components/common/BackToTop';
import { Home } from '@/pages/Home';
import { Events } from '@/pages/Events';
import { EventRegistration } from '@/pages/EventRegistration';
import { WorkplaceProductivity } from '@/pages/services/WorkplaceProductivity';
import { WorkplaceSecurity } from '@/pages/services/WorkplaceSecurity';
import { WorkplaceAI } from '@/pages/services/WorkplaceAI';
import { WorkplaceAutomation } from '@/pages/services/WorkplaceAutomation';
import { WorkplaceBackup } from '@/pages/services/WorkplaceBackup';
import { CloudMigration } from '@/pages/services/CloudMigration';
import { Blog } from '@/pages/Blog';
import { BlogPost } from '@/pages/BlogPost';
import { News } from '@/pages/News';
import { NewsArticle } from '@/pages/NewsArticle';
import { CaseStudies } from '@/pages/CaseStudies';
import { CaseStudyDetail } from '@/pages/CaseStudyDetail';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#060606]">
      <ScrollProgress />
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventRegistration />} />
          <Route path="/services/workplace-productivity" element={<WorkplaceProductivity />} />
          <Route path="/services/workplace-security" element={<WorkplaceSecurity />} />
          <Route path="/services/workplace-ai" element={<WorkplaceAI />} />
          <Route path="/services/workplace-automation" element={<WorkplaceAutomation />} />
          <Route path="/services/workplace-backup" element={<WorkplaceBackup />} />
          <Route path="/services/cloud-migration" element={<CloudMigration />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <BackToTop />}
    </div>
  );
}

export default App;
