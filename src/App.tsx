import { Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { ScrollProgress } from '@/components/common/ScrollProgress';
import { BackToTop } from '@/components/common/BackToTop';
import { Home } from '@/pages/Home';
import { Events } from '@/pages/Events';
import { EventRegistration } from '@/pages/EventRegistration';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventRegistration />} />
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
