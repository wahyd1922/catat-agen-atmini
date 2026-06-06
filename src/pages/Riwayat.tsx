import React, { useState } from 'react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowDownCircle, ArrowUpCircle, Smartphone, Wallet, PlusCircle, MinusCircle, Edit2, Trash2, X } from 'lucide-react';

const initialDummyTransactions = [
  { id: 1, type: 'MODAL_AWAL', amount: 2000000, fee: 0, notes: 'Modal laci pagi', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 2, type: 'TARIK_TUNAI', amount: 500000, fee: 5000, notes: 'Tarik BNI', created_at: new Date(Date.now() - 43200000).toISOString() },
  { id: 3, type: 'SETOR_TUNAI', amount: 1000000, fee: 10000, notes: 'Setor BRI', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 4, type: 'PULSA', amount: 52000, fee: 2000, notes: 'Pulsa Telkomsel 50k', created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 5, type: 'PENGELUARAN_LAIN', amount: 15000, fee: 0, notes: 'Beli kertas struk thermal', created_at: new Date(Date.now() - 1800000).toISOString() },
];

export function Riwayat() {
  const [transactions, setTransactions] = useState(initialDummyTransactions);
  const [editingTrx, setEditingTrx] = useState<any>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'MODAL_AWAL': return <Wallet className="h-5 w-5 text-indigo-500" />;
      case 'TARIK_TUNAI': return <ArrowDownCircle className="h-5 w-5 text-blue-500" />;
      case 'SETOR_TUNAI': return <ArrowUpCircle className="h-5 w-5 text-emerald-500" />;
      case 'PULSA': return <Smartphone className="h-5 w-5 text-purple-500" />;
      case 'PEMASUKAN_LAIN': return <PlusCircle className="h-5 w-5 text-teal-500" />;
      case 'PENGELUARAN_LAIN': return <MinusCircle className="h-5 w-5 text-red-500" />;
      default: return null;
    }
  };

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

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini? Saldo buku kas akan ikut berubah.')) {
      setTransactions(transactions.filter(t => t.id !== id));
      alert('Mode Demo: Transaksi dihapus (hanya di tampilan)');
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    setTransactions(transactions.map(t => t.id === editingTrx.id ? editingTrx : t));
    setEditingTrx(null);
    alert('Mode Demo: Transaksi berhasil diubah (hanya di tampilan)');
  };

  const isFeeDisabled = editingTrx?.type === 'MODAL_AWAL' || editingTrx?.type === 'PEMASUKAN_LAIN' || editingTrx?.type === 'PENGELUARAN_LAIN';

  return (
    <div className="space-y-6 max-w-6xl mx-auto relative">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Transaksi</h2>
        <p className="text-slate-500 mt-1">Daftar seluruh catatan pemasukan dan pengeluaran Anda.</p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-4">Waktu</th>
                <th scope="col" className="px-6 py-4">Jenis Transaksi</th>
                <th scope="col" className="px-6 py-4">Nominal</th>
                <th scope="col" className="px-6 py-4">Admin/Untung</th>
                <th scope="col" className="px-6 py-4">Catatan</th>
                <th scope="col" className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Belum ada data transaksi.
                  </td>
                </tr>
              ) : (
                transactions.map((trx) => (
                  <tr key={trx.id} className="bg-white hover:bg-slate-50/80 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {format(new Date(trx.created_at), 'dd MMM yyyy HH:mm', { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          trx.type === 'MODAL_AWAL' ? 'bg-indigo-50' :
                          trx.type === 'TARIK_TUNAI' ? 'bg-blue-50' :
                          trx.type === 'SETOR_TUNAI' ? 'bg-emerald-50' :
                          trx.type === 'PULSA' ? 'bg-purple-50' :
                          trx.type === 'PEMASUKAN_LAIN' ? 'bg-teal-50' :
                          'bg-red-50'
                        }`}>
                          {getIcon(trx.type)}
                        </div>
                        <span className="font-semibold text-slate-900">{getTypeLabel(trx.type)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatRupiah(trx.amount)}
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {trx.fee > 0 ? (
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                          +{formatRupiah(trx.fee)}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[200px] truncate" title={trx.notes}>
                      {trx.notes || <span className="text-slate-400 italic">Tidak ada catatan</span>}
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
                <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                  {getIcon(editingTrx.type)}
                </div>
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
