import React, { useMemo, useState, useEffect } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowDownRight, ArrowUpRight, Wallet, Trash2, Edit2, X, Calendar as CalendarIcon, Filter } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export function BukuKas() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [editingTrx, setEditingTrx] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('ALL');

  const isDemo = sessionStorage.getItem('demo_mode') === 'true';

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const fetchTransactions = async () => {
    if (isDemo) {
      setTransactions([
        { id: '1', type: 'MODAL_AWAL', amount: 2000000, fee: 0, notes: 'Modal laci pagi', created_at: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', type: 'TARIK_TUNAI', amount: 500000, fee: 5000, notes: 'Tarik BNI', created_at: new Date(Date.now() - 43200000).toISOString() },
      ]);
      setLoading(false);
      return;
    }

    if (!user) return;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('created_at', thirtyDaysAgo.toISOString())
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

  const handleDelete = async (trxId: string) => {
    if (isDemo) {
      setTransactions(transactions.filter(t => t.id !== trxId));
      toast.success('Transaksi dihapus (Mode Demo)');
      return;
    }

    const { error } = await supabase.from('transactions').delete().eq('id', trxId);
    if (!error) {
      setTransactions(transactions.filter(t => t.id !== trxId));
      toast.success('Transaksi berhasil dihapus');
    } else {
      toast.error('Gagal menghapus: ' + error.message);
    }
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemo) {
      setTransactions(transactions.map(t => t.id === editingTrx.id ? editingTrx : t));
      setEditingTrx(null);
      toast.success('Transaksi diubah (Mode Demo)');
      return;
    }

    const { error } = await supabase
      .from('transactions')
      .update({
        amount: editingTrx.amount,
        fee: editingTrx.fee,
        notes: editingTrx.notes
      })
      .eq('id', editingTrx.id);

    if (!error) {
      setTransactions(transactions.map(t => t.id === editingTrx.id ? editingTrx : t));
      setEditingTrx(null);
      toast.success('Transaksi berhasil diubah');
    } else {
      toast.error('Gagal mengedit: ' + error.message);
    }
  };

  const uniqueDates = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    const dates = transactions.map(t => {
      const d = new Date(t.created_at);
      return isNaN(d.getTime()) ? null : format(d, 'yyyy-MM-dd');
    }).filter(Boolean) as string[];
    
    return [...new Set(dates)].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  }, [transactions]);

  const fullMutasiKas = useMemo(() => {
    let currentBalance = 0;
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    
    const sorted = [...safeTransactions].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return sorted.map((trx) => {
      let debit = 0;
      let kredit = 0;

      switch (trx.type) {
        case 'MODAL_AWAL': debit = trx.amount; break;
        case 'TARIK_TUNAI': kredit = trx.amount; debit = trx.fee; break;
        case 'SETOR_TUNAI': debit = trx.amount + trx.fee; break;
        case 'PULSA': debit = trx.amount + trx.fee; break;
        case 'PEMASUKAN_LAIN': debit = trx.amount; break;
        case 'PENGELUARAN_LAIN': kredit = trx.amount; break;
      }

      currentBalance += (debit - kredit);

      return { ...trx, debit, kredit, balance: currentBalance };
    }).reverse();
  }, [transactions]);

  const filteredMutasi = useMemo(() => {
    if (selectedDate === 'ALL') return fullMutasiKas;
    
    return fullMutasiKas.filter(trx => {
      try {
        const trxDate = new Date(trx.created_at);
        const filterDate = new Date(selectedDate);
        return isSameDay(trxDate, filterDate);
      } catch (e) {
        return false;
      }
    });
  }, [fullMutasiKas, selectedDate]);

  const isFeeDisabled = editingTrx?.type === 'MODAL_AWAL' || editingTrx?.type === 'PEMASUKAN_LAIN' || editingTrx?.type === 'PENGELUARAN_LAIN';

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'MODAL_AWAL': return 'Modal Kas';
      case 'TARIK_TUNAI': return 'Tarik Tunai';
      case 'SETOR_TUNAI': return 'Setor Tunai';
      case 'PULSA': return 'Pulsa/Token';
      case 'PEMASUKAN_LAIN': return 'Pemasukan';
      case 'PENGELUARAN_LAIN': return 'Pengeluaran';
      default: return type;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Buku Kas (Laci Tunai)</h2>
          <p className="text-slate-500 mt-1">
            Data otomatis dibatasi maksimal <span className="font-semibold text-slate-700">30 hari terakhir</span>.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-200">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm font-medium text-slate-700 bg-transparent border-0 focus:ring-0 cursor-pointer p-0"
          >
            <option value="ALL">Semua Tanggal</option>
            {uniqueDates.map(date => (
              <option key={date} value={date}>
                {format(new Date(date), 'dd MMMM yyyy', { locale: id })}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Uang Masuk {selectedDate !== 'ALL' && 'Harian'}</p>
            <p className="text-xl font-bold text-emerald-600 mt-1">
              {formatRupiah(filteredMutasi.reduce((acc, curr) => acc + curr.debit, 0))}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <ArrowDownRight className="h-5 w-5 text-emerald-500" />
          </div>
        </div>
        <div className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Total Uang Keluar {selectedDate !== 'ALL' && 'Harian'}</p>
            <p className="text-xl font-bold text-red-600 mt-1">
              {formatRupiah(filteredMutasi.reduce((acc, curr) => acc + curr.kredit, 0))}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center">
            <ArrowUpRight className="h-5 w-5 text-red-500" />
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 shadow-sm flex items-center justify-between text-white">
          <div>
            <p className="text-sm font-medium text-blue-100">
              {selectedDate === 'ALL' ? 'Sisa Saldo Laci Saat Ini' : `Saldo Akhir di Tgl Ini`}
            </p>
            <p className="text-2xl font-bold mt-1">
              {formatRupiah(filteredMutasi.length > 0 ? filteredMutasi[0].balance : 0)}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4">Waktu</th>
                <th scope="col" className="px-6 py-4">Keterangan</th>
                <th scope="col" className="px-6 py-4 text-right">Pemasukan</th>
                <th scope="col" className="px-6 py-4 text-right">Pengeluaran</th>
                <th scope="col" className="px-6 py-4 text-right bg-blue-50/50">Saldo Laci</th>
                <th scope="col" className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredMutasi.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Tidak ada transaksi pada tanggal ini.
                  </td>
                </tr>
              ) : (
                filteredMutasi.map((trx) => (
                  <tr key={trx.id} className="bg-white hover:bg-slate-50/80 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {safeFormatDate(trx.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-slate-900 block">{trx.notes || trx.type || 'Transaksi'}</span>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        {trx.type ? trx.type.replace('_', ' ') : 'Lainnya'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-emerald-600">
                      {trx.debit > 0 ? `+ ${formatRupiah(trx.debit)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600">
                      {trx.kredit > 0 ? `- ${formatRupiah(trx.kredit)}` : '-'}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 bg-blue-50/20">
                      {formatRupiah(trx.balance)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => setEditingTrx({...trx})}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Edit Transaksi"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(trx.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Memuat data...</div>
          ) : filteredMutasi.length === 0 ? (
            <div className="p-8 text-center text-slate-500">Tidak ada transaksi pada tanggal ini.</div>
          ) : (
            filteredMutasi.map((trx) => (
              <div key={trx.id} className="p-4 bg-white space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-semibold text-slate-900 block">{trx.notes || trx.type || 'Transaksi'}</span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block">
                      {trx.type ? trx.type.replace('_', ' ') : 'Lainnya'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setEditingTrx({...trx})} className="p-1.5 text-blue-600 bg-blue-50 rounded-md">
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(trx.id)} className="p-1.5 text-red-600 bg-red-50 rounded-md">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm pt-2 border-t border-slate-50">
                  <div>
                    <span className="text-slate-500 block text-xs">Waktu</span>
                    <span className="font-medium text-slate-700">{safeFormatDate(trx.created_at)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-xs">Uang Laci</span>
                    {trx.debit > 0 ? (
                      <span className="font-semibold text-emerald-600">+{formatRupiah(trx.debit)}</span>
                    ) : trx.kredit > 0 ? (
                      <span className="font-semibold text-red-600">-{formatRupiah(trx.kredit)}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-blue-50/50 p-2.5 rounded-lg flex justify-between items-center mt-2 border border-blue-100/50">
                  <span className="text-xs font-semibold text-blue-800 uppercase tracking-wider">Sisa Saldo</span>
                  <span className="font-bold text-slate-900">{formatRupiah(trx.balance)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingTrx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-lg">Edit Transaksi</h3>
              <button 
                onClick={() => setEditingTrx(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="p-6 space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-3 mb-2">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Jenis Transaksi</p>
                  <p className="text-sm font-semibold text-slate-900">{getTypeLabel(editingTrx.type)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nominal Utama</label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-slate-500 font-medium">Rp</span>
                  </div>
                  <input
                    type="number"
                    required
                    value={editingTrx.amount}
                    onChange={(e) => setEditingTrx({...editingTrx, amount: Number(e.target.value)})}
                    className="block w-full rounded-xl border-0 py-2.5 pl-12 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {!isFeeDisabled && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biaya Admin / Untung</label>
                  <div className="relative rounded-xl shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-slate-500 font-medium">Rp</span>
                    </div>
                    <input
                      type="number"
                      required={!isFeeDisabled}
                      value={editingTrx.fee}
                      onChange={(e) => setEditingTrx({...editingTrx, fee: Number(e.target.value)})}
                      className="block w-full rounded-xl border-0 py-2.5 pl-12 pr-4 text-emerald-700 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm font-medium transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catatan</label>
                <input
                  type="text"
                  required={editingTrx.type === 'PEMASUKAN_LAIN' || editingTrx.type === 'PENGELUARAN_LAIN'}
                  value={editingTrx.notes}
                  onChange={(e) => setEditingTrx({...editingTrx, notes: e.target.value})}
                  className="block w-full rounded-xl border-0 py-2.5 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTrx(null)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-sm rounded-xl transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
