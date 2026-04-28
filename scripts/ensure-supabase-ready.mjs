import 'dotenv/config';
import { spawnSync } from 'node:child_process';
import { Client } from 'pg';

const requiredPublicEnv = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const databaseUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
const isVercelBuild = process.env.VERCEL === '1';
const skipSchemaCheck = process.env.SKIP_SUPABASE_SCHEMA_CHECK === '1';
const strictSchemaCheck = ['1', 'true', 'yes'].includes(
  String(process.env.STRICT_SUPABASE_BUILD || '').toLowerCase(),
);
const requiredTables = [
  'public.categories',
  'public.products',
  'public.site_settings',
  'public.orders',
  'public.site_stats',
];

function fail(message) {
  console.error(message);
  process.exit(1);
}

function runBootstrap() {
  const result = spawnSync(process.execPath, ['./scripts/setup-supabase.mjs'], {
    stdio: 'inherit',
    cwd: process.cwd(),
    env: process.env,
  });

  if (result.status !== 0) {
    fail('Supabase bootstrap failed. Build stopped.');
  }
}

async function getMissingTables() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();

  try {
    const { rows } = await client.query(
      `
        select
          exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'categories') as has_categories,
          exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'products') as has_products,
          exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'site_settings') as has_site_settings,
          exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'orders') as has_orders,
          exists(select 1 from information_schema.tables where table_schema = 'public' and table_name = 'site_stats') as has_site_stats
      `,
    );

    const row = rows[0] || {};
    return requiredTables.filter((tableName) => {
      if (tableName === 'public.categories') {
        return !row.has_categories;
      }

      if (tableName === 'public.products') {
        return !row.has_products;
      }

      if (tableName === 'public.site_settings') {
        return !row.has_site_settings;
      }

      if (tableName === 'public.orders') {
        return !row.has_orders;
      }

      if (tableName === 'public.site_stats') {
        return !row.has_site_stats;
      }

      return true;
    });
  } finally {
    await client.end().catch(() => {});
  }
}

async function main() {
  const missingEnv = requiredPublicEnv.filter((key) => !process.env[key]);

  if (missingEnv.length > 0) {
    fail(
      `Missing required environment variables for build: ${missingEnv.join(', ')}.`,
    );
  }

  if (skipSchemaCheck) {
    console.log('Skipping Supabase schema check because SKIP_SUPABASE_SCHEMA_CHECK=1.');
    return;
  }

  if (isVercelBuild && !strictSchemaCheck) {
    console.log('Skipping Supabase schema bootstrap on Vercel build. Public env is present and strict schema check is disabled.');
    return;
  }

  if (!databaseUrl) {
    fail('Missing SUPABASE_DB_URL (or DATABASE_URL). Build stopped before schema verification.');
  }

  console.log('Checking Supabase schema before build...');
  runBootstrap();

  const missingTables = await getMissingTables();

  if (missingTables.length > 0) {
    fail(`Supabase schema is still incomplete. Missing tables: ${missingTables.join(', ')}.`);
  }

  console.log('Supabase schema is ready. Continuing build...');
}

main().catch((error) => {
  fail(error?.message || 'Supabase readiness check failed.');
});
