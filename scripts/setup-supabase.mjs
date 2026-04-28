import 'dotenv/config';
import { Client } from 'pg';

const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error(
    'Missing SUPABASE_DB_URL (or DATABASE_URL). Add your Supabase Postgres connection string to .env before running npm run dev.',
  );
  process.exit(1);
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

const bootstrapSql = `
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  begin
    new.updated_at = timezone('utc', now());
  exception
    when undefined_column then
      return new;
  end;
  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  order_index integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.categories
  add column if not exists icon text;

alter table public.categories
  add column if not exists created_at timestamptz default timezone('utc', now());

alter table public.categories
  add column if not exists updated_at timestamptz default timezone('utc', now());

update public.categories
set
  created_at = coalesce(created_at, timezone('utc', now())),
  updated_at = coalesce(updated_at, timezone('utc', now()))
where created_at is null or updated_at is null;

alter table public.categories
  alter column created_at set default timezone('utc', now());

alter table public.categories
  alter column updated_at set default timezone('utc', now());

create unique index if not exists categories_name_unique_idx
  on public.categories (lower(name));

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  is_available boolean not null default true,
  click_count bigint not null default 0,
  image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists products_category_idx
  on public.products (category);

create index if not exists products_available_idx
  on public.products (is_available);

alter table public.products
  add column if not exists click_count bigint default 0;

alter table public.products
  add column if not exists created_at timestamptz default timezone('utc', now());

alter table public.products
  add column if not exists updated_at timestamptz default timezone('utc', now());

update public.products
set
  click_count = coalesce(click_count, 0),
  created_at = coalesce(created_at, timezone('utc', now())),
  updated_at = coalesce(updated_at, timezone('utc', now()))
where click_count is null or created_at is null or updated_at is null;

alter table public.products
  alter column click_count set default 0;

update public.products
set click_count = 0
where click_count is null;

alter table public.products
  alter column created_at set default timezone('utc', now());

alter table public.products
  alter column updated_at set default timezone('utc', now());

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_category_fk'
  ) then
    alter table public.products
      add constraint products_category_fk
      foreign key (category)
      references public.categories (name)
      on update cascade
      on delete restrict;
  end if;
exception
  when duplicate_object then
    null;
  when others then
    raise notice 'Skipping products_category_fk creation: %', sqlerrm;
end
$$;

create table if not exists public.site_settings (
  id text primary key default 'default',
  hero_image_url text,
  phone_number text,
  google_maps_url text,
  whatsapp_url text,
  messenger_url text,
  telegram_url text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  orders_enabled boolean not null default false,
  service_country text,
  service_region text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_settings_singleton check (id = 'default')
);

alter table public.site_settings
  add column if not exists hero_image_url text;

alter table public.site_settings
  add column if not exists phone_number text;

alter table public.site_settings
  add column if not exists google_maps_url text;

alter table public.site_settings
  add column if not exists whatsapp_url text;

alter table public.site_settings
  add column if not exists messenger_url text;

alter table public.site_settings
  add column if not exists telegram_url text;

alter table public.site_settings
  add column if not exists facebook_url text;

alter table public.site_settings
  add column if not exists instagram_url text;

alter table public.site_settings
  add column if not exists tiktok_url text;

alter table public.site_settings
  add column if not exists orders_enabled boolean default false;

alter table public.site_settings
  add column if not exists service_country text;

alter table public.site_settings
  add column if not exists service_region text;

alter table public.site_settings
  add column if not exists created_at timestamptz default timezone('utc', now());

alter table public.site_settings
  add column if not exists updated_at timestamptz default timezone('utc', now());

update public.site_settings
set
  orders_enabled = coalesce(orders_enabled, false),
  created_at = coalesce(created_at, timezone('utc', now())),
  updated_at = coalesce(updated_at, timezone('utc', now()))
where orders_enabled is null or created_at is null or updated_at is null;

alter table public.site_settings
  alter column orders_enabled set default false;

update public.site_settings
set orders_enabled = false
where orders_enabled is null;

alter table public.site_settings
  alter column created_at set default timezone('utc', now());

alter table public.site_settings
  alter column updated_at set default timezone('utc', now());

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products (id) on update cascade on delete set null,
  product_name text not null,
  product_price numeric(10, 2) not null check (product_price >= 0),
  product_category text,
  customer_name text not null,
  customer_phone text not null,
  quantity integer not null check (quantity > 0),
  status text not null default 'new' check (status in ('new', 'processing', 'completed', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.orders
  add column if not exists product_id uuid;

alter table public.orders
  add column if not exists product_name text;

alter table public.orders
  add column if not exists product_price numeric(10, 2);

alter table public.orders
  add column if not exists product_category text;

alter table public.orders
  add column if not exists customer_name text;

alter table public.orders
  add column if not exists customer_phone text;

alter table public.orders
  add column if not exists quantity integer;

alter table public.orders
  add column if not exists status text default 'new';

alter table public.orders
  add column if not exists created_at timestamptz default timezone('utc', now());

alter table public.orders
  add column if not exists updated_at timestamptz default timezone('utc', now());

update public.orders
set
  status = coalesce(nullif(status, ''), 'new'),
  quantity = coalesce(quantity, 1),
  created_at = coalesce(created_at, timezone('utc', now())),
  updated_at = coalesce(updated_at, timezone('utc', now()))
where status is null or quantity is null or created_at is null or updated_at is null;

alter table public.orders
  alter column status set default 'new';

alter table public.orders
  alter column quantity set default 1;

alter table public.orders
  alter column created_at set default timezone('utc', now());

alter table public.orders
  alter column updated_at set default timezone('utc', now());

create index if not exists orders_status_idx
  on public.orders (status);

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);

create index if not exists orders_product_id_idx
  on public.orders (product_id);

create table if not exists public.site_stats (
  id text primary key default 'global',
  total_visits bigint not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint site_stats_singleton check (id = 'global')
);

alter table public.site_stats
  add column if not exists total_visits bigint default 0;

alter table public.site_stats
  add column if not exists created_at timestamptz default timezone('utc', now());

alter table public.site_stats
  add column if not exists updated_at timestamptz default timezone('utc', now());

update public.site_stats
set
  total_visits = coalesce(total_visits, 0),
  created_at = coalesce(created_at, timezone('utc', now())),
  updated_at = coalesce(updated_at, timezone('utc', now()))
where total_visits is null or created_at is null or updated_at is null;

alter table public.site_stats
  alter column total_visits set default 0;

alter table public.site_stats
  alter column created_at set default timezone('utc', now());

alter table public.site_stats
  alter column updated_at set default timezone('utc', now());

alter table public.categories
  alter column icon drop default;

alter table public.categories
  alter column icon drop not null;

update public.site_settings
set
  hero_image_url = case
    when hero_image_url = 'https://i.ibb.co/3KcTXDy/1633-x-500.png' then null
    else hero_image_url
  end,
  phone_number = case
    when phone_number = '0673740332' then null
    else phone_number
  end,
  google_maps_url = case
    when google_maps_url = 'https://maps.app.goo.gl/7WS3F2kLbbaA58F27' then null
    else google_maps_url
  end;

insert into public.site_settings (
  id
)
values (
  'default'
)
on conflict (id) do nothing;

insert into public.site_stats (
  id
)
values (
  'global'
)
on conflict (id) do nothing;

create or replace function public.create_order(
  target_product_id uuid,
  customer_name_input text,
  customer_phone_input text,
  order_quantity integer
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  source_product public.products%rowtype;
  created_order public.orders;
  normalized_customer_name text := trim(coalesce(customer_name_input, ''));
  normalized_customer_phone text := trim(coalesce(customer_phone_input, ''));
  normalized_quantity integer := coalesce(order_quantity, 0);
begin
  if not exists (
    select 1
    from public.site_settings
    where id = 'default'
      and coalesce(orders_enabled, false) = true
  ) then
    raise exception 'orders_disabled';
  end if;

  if normalized_customer_name = '' then
    raise exception 'customer_name_required';
  end if;

  if normalized_customer_phone = '' then
    raise exception 'customer_phone_required';
  end if;

  if normalized_quantity < 1 then
    raise exception 'invalid_quantity';
  end if;

  select *
  into source_product
  from public.products
  where id = target_product_id
    and is_available = true;

  if not found then
    raise exception 'product_not_available';
  end if;

  insert into public.orders (
    product_id,
    product_name,
    product_price,
    product_category,
    customer_name,
    customer_phone,
    quantity
  )
  values (
    source_product.id,
    source_product.name,
    source_product.price,
    source_product.category,
    normalized_customer_name,
    normalized_customer_phone,
    normalized_quantity
  )
  returning *
  into created_order;

  return created_order;
end;
$$;

create or replace function public.track_product_click(target_product_id uuid)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  next_click_count bigint;
begin
  update public.products
  set click_count = coalesce(click_count, 0) + 1
  where id = target_product_id
  returning click_count into next_click_count;

  return coalesce(next_click_count, 0);
end;
$$;

create or replace function public.track_site_visit()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  next_total_visits bigint;
begin
  insert into public.site_stats (id, total_visits)
  values ('global', 0)
  on conflict (id) do nothing;

  update public.site_stats
  set total_visits = coalesce(total_visits, 0) + 1
  where id = 'global'
  returning total_visits into next_total_visits;

  return coalesce(next_total_visits, 0);
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
before update on public.orders
for each row
execute function public.set_updated_at();

drop trigger if exists set_site_stats_updated_at on public.site_stats;
create trigger set_site_stats_updated_at
before update on public.site_stats
for each row
execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.site_stats enable row level security;

drop policy if exists categories_public_read on public.categories;
create policy categories_public_read
on public.categories
for select
using (true);

drop policy if exists categories_authenticated_manage on public.categories;
create policy categories_authenticated_manage
on public.categories
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists products_public_read on public.products;
create policy products_public_read
on public.products
for select
using (is_available = true or auth.role() = 'authenticated');

drop policy if exists products_authenticated_manage on public.products;
create policy products_authenticated_manage
on public.products
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists site_settings_public_read on public.site_settings;
create policy site_settings_public_read
on public.site_settings
for select
using (true);

drop policy if exists site_settings_authenticated_manage on public.site_settings;
create policy site_settings_authenticated_manage
on public.site_settings
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists orders_authenticated_manage on public.orders;
create policy orders_authenticated_manage
on public.orders
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists site_stats_authenticated_manage on public.site_stats;
create policy site_stats_authenticated_manage
on public.site_stats
for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

grant execute on function public.create_order(uuid, text, text, integer) to anon, authenticated;
grant execute on function public.track_product_click(uuid) to anon, authenticated;
grant execute on function public.track_site_visit() to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'images',
  'images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists images_public_read on storage.objects;
create policy images_public_read
on storage.objects
for select
using (bucket_id = 'images');

drop policy if exists images_authenticated_insert on storage.objects;
create policy images_authenticated_insert
on storage.objects
for insert
with check (
  bucket_id = 'images'
  and auth.role() = 'authenticated'
);

drop policy if exists images_authenticated_update on storage.objects;
create policy images_authenticated_update
on storage.objects
for update
using (
  bucket_id = 'images'
  and auth.role() = 'authenticated'
)
with check (
  bucket_id = 'images'
  and auth.role() = 'authenticated'
);

drop policy if exists images_authenticated_delete on storage.objects;
create policy images_authenticated_delete
on storage.objects
for delete
using (
  bucket_id = 'images'
  and auth.role() = 'authenticated'
);
`;

async function main() {
  await client.connect();
  await client.query(bootstrapSql);
  console.log('Supabase bootstrap completed.');
}

main()
  .catch((error) => {
    console.error('Supabase bootstrap failed.');
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end().catch(() => {});
  });
