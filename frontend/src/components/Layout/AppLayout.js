import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, FileText, BookOpen, Receipt, Users, Package, Settings, LogOut, Menu, X, MessageSquare, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Bills', href: '/bills', icon: FileText },
    { name: 'Ledger', href: '/ledger', icon: BookOpen },
    { name: 'Invoices', href: '/invoices', icon: Receipt },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-surface">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-white border-r border-slate-200">
          <div className="flex items-center h-16 px-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold font-manrope text-primary">Bizupy</h1>
          </div>
          
          <div className="flex-1 flex flex-col overflow-y-auto py-4">
            <nav className="flex-1 px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    data-testid={`nav-${item.name.toLowerCase()}`}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                      active
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-semibold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              data-testid="logout-button"
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold font-manrope text-primary">Bizupy</h1>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
        >
          {mobileSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black bg-opacity-50" onClick={() => setMobileSidebarOpen(false)}>
          <div className="fixed inset-y-0 left-0 w-64 bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="h-16 border-b border-slate-200" />
            <nav className="px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                      active
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto mt-16 md:mt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50">
        <Link
          to="/dashboard"
          data-testid="mobile-nav-dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/dashboard') ? 'text-primary' : 'text-slate-600'
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        <Link
          to="/bills"
          data-testid="mobile-nav-bills"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/bills') ? 'text-primary' : 'text-slate-600'
          }`}
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs mt-1">Bills</span>
        </Link>
        <Link
          to="/invoices"
          data-testid="mobile-nav-invoices"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/invoices') ? 'text-primary' : 'text-slate-600'
          }`}
        >
          <Receipt className="h-5 w-5" />
          <span className="text-xs mt-1">Invoices</span>
        </Link>
        <Link
          to="/settings"
          data-testid="mobile-nav-settings"
          className={`flex flex-col items-center justify-center flex-1 h-full ${
            isActive('/settings') ? 'text-primary' : 'text-slate-600'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs mt-1">More</span>
        </Link>
      </div>
    </div>
  );
};

export default AppLayout;