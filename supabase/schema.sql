-- =========================================================
-- TRENDY SCENTS - SUPABASE DATABASE SCHEMA & SEED SCRIPT
-- Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- =========================================================

-- 1. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  name text not null,
  family text not null,
  notes text not null,
  price numeric not null default 0,
  available boolean not null default true,
  tone text default 'amber',
  image text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- High-speed B-Tree Indexes for Products
create index if not exists idx_products_family on public.products(family);
create index if not exists idx_products_available on public.products(available);

-- Enable RLS on products
alter table public.products enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public read access on products" on public.products;
drop policy if exists "Allow all actions on products" on public.products;

-- Allow public read & write access to products
create policy "Allow all actions on products"
  on public.products for all
  using (true)
  with check (true);


-- 2. ORDERS TABLE
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_email text,
  customer_phone text,
  delivery_address text,
  city text,
  state text,
  total_amount numeric not null default 0,
  payment_method text default 'Bank Transfer',
  payment_status text default 'pending', -- 'pending', 'verified', 'failed'
  order_status text default 'Payment Verification', -- 'Payment Verification', 'Decant Pouring', 'Out for Delivery', 'Ready for Pickup', 'Delivered', 'Cancelled'
  receipt_url text,
  receipt_name text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- High-speed B-Tree Indexes for Orders
create index if not exists idx_orders_number on public.orders(order_number);
create index if not exists idx_orders_status on public.orders(order_status);
create index if not exists idx_orders_created on public.orders(created_at desc);

-- Enable RLS on orders
alter table public.orders enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public insert on orders" on public.orders;
drop policy if exists "Allow public read of own orders" on public.orders;
drop policy if exists "Allow full access for authenticated users on orders" on public.orders;
drop policy if exists "Allow all actions on orders" on public.orders;

-- Allow public read, insert, and update on orders
create policy "Allow all actions on orders"
  on public.orders for all
  using (true)
  with check (true);


-- 3. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  price numeric not null default 0,
  quantity integer not null default 1,
  size text default '10ml',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- High-speed B-Tree Indexes for Order Items
create index if not exists idx_order_items_order_id on public.order_items(order_id);

-- Enable RLS on order_items
alter table public.order_items enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public insert on order_items" on public.order_items;
drop policy if exists "Allow public select on order_items" on public.order_items;
drop policy if exists "Allow full access for authenticated users on order_items" on public.order_items;
drop policy if exists "Allow all actions on order_items" on public.order_items;

-- Allow all actions on order_items
create policy "Allow all actions on order_items"
  on public.order_items for all
  using (true)
  with check (true);


-- 4. SEED INITIAL PRODUCTS DATA
insert into public.products (id, name, family, notes, price, available, tone, image, description)
values
  (
    'caramello-velvet',
    'Caramello Velvet',
    'Gourmand',
    'Toasted Caramel · Amber · Bourbon Vanilla',
    9500,
    true,
    'amber',
    '/images/caramello-velvet.jpg',
    'An intoxicating gourmand creation featuring warm toasted caramel, rich Cambodian amber, and smooth bourbon vanilla extract.'
  ),
  (
    'oud-royale',
    'Oud Royale',
    'Oud',
    'Oud · Amber · Cedarwood',
    8500,
    true,
    'amber',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
    'A regal blend of dark resinous Cambodian oud, glowing warm amber, and smoked cedarwood.'
  ),
  (
    'aventus-type',
    'Fresh Adventure',
    'Fresh',
    'Pineapple · Birch · Blackcurrant',
    7000,
    true,
    'smoke',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=800&fit=crop&q=80',
    'Crisp bergamot and juicy pineapple anchored by dry birch smoke and oakmoss.'
  ),
  (
    'soft-vanilla',
    'Sweet Vanilla',
    'Gourmand',
    'Bourbon Vanilla · Tonka · Sandalwood',
    6500,
    true,
    'parchment',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&h=800&fit=crop&q=80',
    'Creamy Madagascar vanilla beans kissed by warm tonka bean and smooth sandalwood.'
  ),
  (
    'rose-oud',
    'Rose & Oud',
    'Floral',
    'Damask Rose · Saffron · Smoked Oud',
    9000,
    true,
    'deep',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=800&h=800&fit=crop&q=80',
    'Velvety crimson roses steeped in golden saffron and velvety smoked oud oil.'
  ),
  (
    'blue-water',
    'Blue Water',
    'Fresh',
    'Calabrian Citrus · Marine Accord · Vetiver',
    6000,
    true,
    'smoke',
    'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?w=800&h=800&fit=crop&q=80',
    'Cool sea mist infused with zesty grapefruit, crushed mint, and earthy Haitian vetiver.'
  ),
  (
    'sandal-letter',
    'Sandal Letter',
    'Woody',
    'Mysore Sandalwood · Florentine Iris · Leather',
    8000,
    true,
    'amber',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800&h=800&fit=crop&q=80',
    'Silky sandalwood paired with powdery iris root and soft vintage leather notes.'
  ),
  (
    'grand-amber',
    'Grand Amber',
    'Amber',
    'Golden Amber · Benzoin · Vanilla Bean',
    9500,
    true,
    'amber',
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&h=800&fit=crop&q=80',
    'Enveloping resinous amber warmed by styrax benzoin and sweet vanilla nectar.'
  ),
  (
    'velvet-iris',
    'Velvet Iris',
    'Floral',
    'Florentine Iris · Violet Leaf · White Musk',
    7500,
    true,
    'parchment',
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&h=800&fit=crop&q=80',
    'Powdery Tuscan iris blended with crisp violet leaves and silky white musk.'
  )
on conflict (id) do update set
  name = excluded.name,
  family = excluded.family,
  notes = excluded.notes,
  price = excluded.price,
  available = excluded.available,
  tone = excluded.tone,
  image = excluded.image,
  description = excluded.description;
