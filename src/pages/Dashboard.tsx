import React from 'react';
import { Wallet, Landmark, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ringkasan Keuangan</h2>
        <p className="text-slate-500 mt-1">Pantau arus kas dan keuntungan Anda hari ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-50 opacity-50" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Saldo Laci (Tunai)</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">Rp 0</h3>
            </div>
            <div className="rounded-2xl bg-blue-100 p-4 shadow-inner shadow-blue-200">
              <Wallet className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-emerald-50 opacity-50" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Saldo Bank/Aplikasi</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">Rp 0</h3>
            </div>
            <div className="rounded-2xl bg-emerald-100 p-4 shadow-inner shadow-emerald-200">
              <Landmark className="h-7 w-7 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 p-6 shadow-lg shadow-indigo-500/20 text-white">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-black/10" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-indigo-100 uppercase tracking-wider">Keuntungan Hari Ini</p>
              <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">Rp 0</h3>
            </div>
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm border border-white/10">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">Aktivitas Terakhir</h3>
          <Link to="/riwayat" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Lihat Semua <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-slate-400" />
            </div>
            <h4 className="text-slate-900 font-medium">Belum ada transaksi hari ini</h4>
            <p className="text-slate-500 text-sm mt-1 max-w-sm">
              Mulai catat transaksi tarik tunai, setor, atau penjualan pulsa untuk melihat grafiknya di sini.
            </p>
            <Link to="/transaksi" className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
              Catat Transaksi Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
