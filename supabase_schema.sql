create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  type text check (type in ('MODAL_AWAL', 'TARIK_TUNAI', 'SETOR_TUNAI', 'PULSA', 'PEMASUKAN_LAIN', 'PENGELUARAN_LAIN')) not null,
  amount numeric not null,
  fee numeric default 0,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can insert their own transactions"
on public.transactions for insert
with check ( auth.uid() = user_id );

create policy "Users can view their own transactions"
on public.transactions for select
using ( auth.uid() = user_id );

create policy "Users can update their own transactions"
on public.transactions for update
using ( auth.uid() = user_id );

create policy "Users can delete their own transactions"
on public.transactions for delete
using ( auth.uid() = user_id );
