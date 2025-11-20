import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { User } from '../types/user';

interface LayoutProps {
  children: ReactNode;
  user: User | null;
}

const Layout = ({ children, user }: LayoutProps) => {
  if (!user) {
    return <div>Loading...</div>;
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

