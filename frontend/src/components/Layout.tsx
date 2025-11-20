import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // AuthProvider will redirect to login
  }

  return (
    <div className="flex min-h-screen bg-[#0F0F0F]">
      <Sidebar userRole={user.role} userName={user.name} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;

