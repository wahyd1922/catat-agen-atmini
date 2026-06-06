import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  History, 
  BookOpenText,
  LogOut,
  WalletCards,
  Menu,
  X
} from 'lucide-react';

export function Layout() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Catat Transaksi', href: '/transaksi', icon: ArrowRightLeft },
    { name: 'Buku Kas Laci', href: '/buku-kas', icon: BookOpenText },
  ];

  if (!user && !sessionStorage.getItem('demo_mode')) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-72 transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-md shadow-blue-500/20">
              <WalletCards className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">CatatAgen</span>
          </div>
          <button 
            className="lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100vh-4rem)]">
          <nav className="space-y-1.5 p-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all group"
              >
                <item.icon className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                {item.name}
              </a>
            ))}
          </nav>

          <div className="border-t border-slate-100 p-4">
            <div className="mb-4 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Akun Anda</p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {user?.email || 'Akun Demo'}
              </p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('demo_mode');
                handleLogout();
                window.location.reload();
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors group"
            >
              <LogOut className="h-5 w-5 text-red-500 group-hover:text-red-600" />
              Keluar Sesi
            </button>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 lg:px-8 z-10">
          <button
            className="mr-4 lg:hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold text-slate-800">Panel Ringkasan</h1>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200">
                <span className="text-sm font-bold text-blue-700">
                  {(user?.email?.[0] || 'D').toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50/50 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
