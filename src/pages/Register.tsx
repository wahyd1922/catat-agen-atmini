import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { WalletCards } from 'lucide-react';
import toast from 'react-hot-toast';

export function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success('Pendaftaran berhasil!');
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg text-center">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-emerald-100">
            <WalletCards className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900">
            Pendaftaran Berhasil!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Akun agen Anda telah dibuat. Silakan cek email Anda untuk konfirmasi (jika diperlukan), atau langsung coba login.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-40 -left-40 w-96 h-96 rounded-full bg-blue-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
      <div className="absolute -bottom-40 right-20 w-96 h-96 rounded-full bg-indigo-100 mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
      
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/80 backdrop-blur-xl p-10 shadow-2xl border border-white z-10">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <WalletCards className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-8 text-center text-3xl font-extrabold tracking-tight text-slate-900">
            Daftar Agen
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-slate-500">
            Bergabung ke jaringan agen cerdas
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="space-y-5">
            <div>
              <label htmlFor="email-address" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Alamat Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 transition-all"
            >
              {loading ? 'Membuat Akun...' : 'Daftar Sekarang'}
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm font-medium text-slate-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
