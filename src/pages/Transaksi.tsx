import React, { useState } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Smartphone, Wallet, PlusCircle, MinusCircle } from 'lucide-react';

type TransactionType = 'MODAL_AWAL' | 'TARIK_TUNAI' | 'SETOR_TUNAI' | 'PULSA' | 'PEMASUKAN_LAIN' | 'PENGELUARAN_LAIN';

export function Transaksi() {
  const [type, setType] = useState<TransactionType>('TARIK_TUNAI');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Simpan transaksi (Implementasi Database Nanti)');
  };

  const isFeeDisabled = type === 'MODAL_AWAL' || type === 'PEMASUKAN_LAIN' || type === 'PENGELUARAN_LAIN';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Catat Transaksi</h2>
        <p className="text-slate-500 mt-1">Pilih jenis transaksi dan masukkan nominal dengan benar.</p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
          <div>
            <label className="text-sm font-semibold text-slate-900 mb-4 block">Pilih Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              <button
                type="button"
                onClick={() => setType('MODAL_AWAL')}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  type === 'MODAL_AWAL' 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100 ring-1 ring-indigo-500' 
                    : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Wallet className={`h-6 w-6 ${type === 'MODAL_AWAL' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-center">Modal</span>
              </button>
              <button
                type="button"
                onClick={() => setType('TARIK_TUNAI')}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  type === 'TARIK_TUNAI' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100 ring-1 ring-blue-500' 
                    : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <ArrowDownCircle className={`h-6 w-6 ${type === 'TARIK_TUNAI' ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-center">Tarik</span>
              </button>
              <button
                type="button"
                onClick={() => setType('SETOR_TUNAI')}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  type === 'SETOR_TUNAI' 
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-100 ring-1 ring-emerald-500' 
                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <ArrowUpCircle className={`h-6 w-6 ${type === 'SETOR_TUNAI' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-center">Setor</span>
              </button>
              <button
                type="button"
                onClick={() => setType('PULSA')}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  type === 'PULSA' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-sm shadow-purple-100 ring-1 ring-purple-500' 
                    : 'border-slate-200 bg-white hover:border-purple-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <Smartphone className={`h-6 w-6 ${type === 'PULSA' ? 'text-purple-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-center">Pulsa</span>
              </button>
              <button
                type="button"
                onClick={() => setType('PEMASUKAN_LAIN')}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  type === 'PEMASUKAN_LAIN' 
                    ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100 ring-1 ring-teal-500' 
                    : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <PlusCircle className={`h-6 w-6 ${type === 'PEMASUKAN_LAIN' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-center leading-tight">Pemasukan</span>
              </button>
              <button
                type="button"
                onClick={() => setType('PENGELUARAN_LAIN')}
                className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-4 transition-all duration-200 ${
                  type === 'PENGELUARAN_LAIN' 
                    ? 'border-red-500 bg-red-50 text-red-700 shadow-sm shadow-red-100 ring-1 ring-red-500' 
                    : 'border-slate-200 bg-white hover:border-red-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <MinusCircle className={`h-6 w-6 ${type === 'PENGELUARAN_LAIN' ? 'text-red-600' : 'text-slate-400'}`} />
                <span className="text-xs font-semibold text-center leading-tight">Pengeluaran</span>
              </button>
            </div>
          </div>

          <div className="space-y-5 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Nominal Transaksi</label>
              <div className="relative mt-2 rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <span className="text-slate-500 font-medium">Rp</span>
                </div>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 pl-12 pr-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-base font-medium transition-all bg-white"
                  placeholder="0"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-slate-500">
                {type === 'MODAL_AWAL' && 'Modal kas awal untuk laci uang.'}
                {type === 'TARIK_TUNAI' && 'Uang keluar dari Laci, Saldo Digital bertambah.'}
                {type === 'SETOR_TUNAI' && 'Uang masuk ke Laci, Saldo Digital berkurang.'}
                {type === 'PULSA' && 'Saldo Digital berkurang, Saldo Laci bertambah.'}
                {type === 'PEMASUKAN_LAIN' && 'Pemasukan tambahan masuk ke laci.'}
                {type === 'PENGELUARAN_LAIN' && 'Uang keluar dari laci (beli kertas, makan, dll).'}
              </p>
            </div>

            {!isFeeDisabled && (
              <div>
                <label className="block text-sm font-semibold text-slate-700">Biaya Admin / Keuntungan</label>
                <div className="relative mt-2 rounded-xl shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-slate-500 font-medium">Rp</span>
                  </div>
                  <input
                    type="number"
                    required={!isFeeDisabled}
                    value={fee}
                    onChange={(e) => setFee(e.target.value)}
                    className="block w-full rounded-xl border-0 py-3 pl-12 pr-4 text-emerald-700 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-base font-medium transition-all bg-white"
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Catatan {type === 'PEMASUKAN_LAIN' || type === 'PENGELUARAN_LAIN' ? <span className="text-red-500">*Wajib</span> : <span className="text-slate-400 font-normal">(Opsional)</span>}
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  required={type === 'PEMASUKAN_LAIN' || type === 'PENGELUARAN_LAIN'}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm transition-all bg-white"
                  placeholder={
                    type === 'PENGELUARAN_LAIN' ? "Contoh: Beli kertas struk thermal" : 
                    type === 'PEMASUKAN_LAIN' ? "Contoh: Jual softcase HP" : 
                    "Contoh: TRX BNI an Budi Santoso"
                  }
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
