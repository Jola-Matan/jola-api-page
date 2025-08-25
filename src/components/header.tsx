import React from 'react';
import { Button } from './button';
import { ArrowLeft, Monitor, Zap, BookOpen, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  handleNavigate: (screen: string) => void;
  handleLogout: () => void;
}

const navItems = [
  { key: 'capabilities', label: 'Capabilities', icon: <Zap className="w-4 h-4 mr-2" /> },
  { key: 'library', label: 'Library', icon: <BookOpen className="w-4 h-4 mr-2" /> },
];

const Header: React.FC<HeaderProps> = ({ currentPage, handleNavigate, handleLogout }) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-[#F5F5F5] border-[#8A94A6]">
      <Button onClick={() => handleNavigate('home')} variant="ghost" size="sm" className="rounded-xl text-[#232A34] flex items-center">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
      <div className="flex items-center gap-4">
        {navItems.map((item) => (
          <Button
            key={item.key}
            onClick={() => handleNavigate(item.key)}
            variant="outline"
            size="sm"
            className={`rounded-xl flex items-center ${currentPage === item.key ? 'bg-[#232A34] text-white' : 'text-[#232A34]'} ${item.key === 'dashboard' ? 'ml-2' : ''}`}
            style={currentPage === item.key ? { fontWeight: 'bold' } : {}}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
        <Button onClick={handleLogout} variant="destructive" className="ml-4">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header; 