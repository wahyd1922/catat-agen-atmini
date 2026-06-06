import React, { useEffect, useState, useMemo } from 'react';
import { Wallet, Landmark, TrendingUp, ArrowRight, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function Dashboard() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const isDemo = sessionStorage.getItem('demo_mode') === 'true';

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (isDemo) {
      setTransactions([
        { id: '1', type: 'MODAL_AWAL', amount: 2000000, fee: 0, notes: 'Modal laci pagi', created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', type: 'TARIK_TUNAI', amount: 500000, fee: 5000, notes: 'Tarik BNI', created_at: new Date().toISOString() },
      ]);
      setLoading(false);
      return;
    }

    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data || []);
    } else {
      setTransactions([]);
    }
    setLoading(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const safeFormatDate = (dateString: string) => {
    try {
      if (!dateString) return '-';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '-';
      return format(date, 'dd MMM yyyy HH:mm', { locale: id });
    } catch (e) {
      return '-';
    }
  };

  const summary = useMemo(() => {
    let saldoLaci = 0;
    let saldoDigital = 0;
    let keuntunganHariIni = 0;

    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sorted = [...safeTransactions].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    sorted.forEach((trx) => {
      const isToday = new Date(trx.created_at) >= today;

      switch (trx.type) {
        case 'MODAL_AWAL':
          saldoLaci += trx.amount;
          break;
        case 'TARIK_TUNAI':
          saldoLaci -= trx.amount;
          saldoDigital += trx.amount;
          saldoLaci += trx.fee;
          if (isToday) keuntunganHariIni += trx.fee;
          break;
        case 'SETOR_TUNAI':
          saldoLaci += trx.amount;
          saldoDigital -= trx.amount;
          saldoLaci += trx.fee;
          if (isToday) keuntunganHariIni += trx.fee;
          break;
        case 'PULSA':
          saldoDigital -= trx.amount;
          saldoLaci += (trx.amount + trx.fee);
          if (isToday) keuntunganHariIni += trx.fee;
          break;
        case 'PEMASUKAN_LAIN':
          saldoLaci += trx.amount;
          if (isToday) keuntunganHariIni += trx.amount;
          break;
        case 'PENGELUARAN_LAIN':
          saldoLaci -= trx.amount;
          if (isToday) keuntunganHariIni -= trx.amount;
          break;
      }
    });

    return { saldoLaci, saldoDigital, keuntunganHariIni };
  }, [transactions]);

  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 5) : [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ringkasan Keuangan</h2>
        <p className="text-slate-500 mt-1">Pantau arus kas dan keuntungan Anda secara real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-50 opacity-50" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sisa Laci (Tunai)</p>
              <h3 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">{formatRupiah(summary.saldoLaci)}</h3>
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
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Perkiraan Digital</p>
              <h3 className={`text-3xl font-bold mt-2 tracking-tight ${summary.saldoDigital < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {formatRupiah(summary.saldoDigital)}
              </h3>
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
              <h3 className="text-3xl font-bold text-white mt-2 tracking-tight">{formatRupiah(summary.keuntunganHariIni)}</h3>
            </div>
            <div className="rounded-2xl bg-white/20 p-4 backdrop-blur-sm border border-white/10">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 bg-slate-50/50">
          <h3 className="text-lg font-semibold text-slate-800">5 Transaksi Terakhir</h3>
          <Link to="/buku-kas" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
            Lihat Buku Kas <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div>
          {loading ? (
            <div className="p-12 text-center text-slate-500">Memuat data...</div>
          ) : recentTransactions.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Wallet className="h-8 w-8 text-slate-400" />
              </div>
              <h4 className="text-slate-900 font-medium">Belum ada transaksi</h4>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Mulai catat transaksi tarik tunai, setor, atau penjualan pulsa.
              </p>
              <Link to="/transaksi" className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
                Catat Transaksi Baru
              </Link>
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <tbody className="divide-y divide-slate-100">
                    {recentTransactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              trx.type === 'MODAL_AWAL' ? 'bg-indigo-50 text-indigo-600' :
                              trx.type === 'TARIK_TUNAI' ? 'bg-blue-50 text-blue-600' :
                              trx.type === 'SETOR_TUNAI' ? 'bg-emerald-50 text-emerald-600' :
                              trx.type === 'PULSA' ? 'bg-purple-50 text-purple-600' :
                              trx.type === 'PEMASUKAN_LAIN' ? 'bg-teal-50 text-teal-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {trx.type === 'PENGELUARAN_LAIN' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{trx.notes || trx.type}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{safeFormatDate(trx.created_at)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="font-semibold text-slate-900">{formatRupiah(trx.amount)}</p>
                          {trx.fee > 0 && (
                            <p className="text-xs font-medium text-emerald-600 mt-0.5">+ Untung {formatRupiah(trx.fee)}</p>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="md:hidden divide-y divide-slate-100">
                {recentTransactions.map((trx) => (
                  <div key={trx.id} className="p-4 bg-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        trx.type === 'MODAL_AWAL' ? 'bg-indigo-50 text-indigo-600' :
                        trx.type === 'TARIK_TUNAI' ? 'bg-blue-50 text-blue-600' :
                        trx.type === 'SETOR_TUNAI' ? 'bg-emerald-50 text-emerald-600' :
                        trx.type === 'PULSA' ? 'bg-purple-50 text-purple-600' :
                        trx.type === 'PEMASUKAN_LAIN' ? 'bg-teal-50 text-teal-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {trx.type === 'PENGELUARAN_LAIN' ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm truncate max-w-[150px]">{trx.notes || trx.type}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{safeFormatDate(trx.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 text-sm">{formatRupiah(trx.amount)}</p>
                      {trx.fee > 0 && (
                        <p className="text-[10px] font-medium text-emerald-600 mt-0.5">+{formatRupiah(trx.fee)}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
