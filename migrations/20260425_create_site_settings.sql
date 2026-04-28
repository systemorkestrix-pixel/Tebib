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

alter table public.categories
  alter column icon drop default;

alter table public.categories
  alter column icon drop not null;

alter table public.products
  add column if not exists click_count bigint default 0;

update public.products
set click_count = coalesce(click_count, 0)
where click_count is null;

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

alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.site_stats enable row level security;

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
