import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Auth } from '@/lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    Auth.getSession().then(s => {
      setAuthed(!!s);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;
  if (!authed) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}
