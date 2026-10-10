/**
 * JK WASHING CENTER - Initial Admin Account Setup Script
 *
 * Usage:
 *   node scripts/create-admin.js <admin-email> <admin-password>
 *
 * Example:
 *   node scripts/create-admin.js owner@jkwashingcenter.com SuperSecurePassword123!
 *
 * This script uses the server-only SUPABASE_SERVICE_ROLE_KEY to securely provision
 * the initial administrator account in auth.users and the public.profiles table.
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function createAdmin() {
  const args = process.argv.slice(2);
  const email = args[0] || process.env.ADMIN_INITIAL_EMAIL;
  const password = args[1] || process.env.ADMIN_INITIAL_PASSWORD;

  if (!email || !password) {
    console.error('❌ Error: Missing credentials.');
    console.log('Usage: node scripts/create-admin.js <email> <password>');
    process.exit(1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes('your-project-id')) {
    console.error('❌ Error: Supabase credentials not configured in .env.local.');
    console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log(`🔧 Provisioning admin user: ${email}...`);

  // 1. Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: 'Jagdish Kumar (Owner)',
      role: 'admin',
    },
  });

  if (authError) {
    if (authError.message.includes('already exists') || authError.code === 'email_exists') {
      console.log('ℹ️ User already exists in auth. Updating profile role to admin...');
    } else {
      console.error('❌ Failed to create user in auth:', authError.message);
      process.exit(1);
    }
  }

  const userId = authUser?.user?.id;

  if (userId) {
    // 2. Insert into public.profiles
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: userId,
      email,
      full_name: 'Jagdish Kumar (Owner)',
      role: 'admin',
      is_active: true,
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error('❌ Error updating profiles table:', profileError.message);
      process.exit(1);
    }
  }

  console.log('✅ Admin account provisioned successfully!');
  console.log(`Email: ${email}`);
  console.log('Role: admin (full access to all modules, settings, expenses, reports)');
}

createAdmin().catch(console.error);
