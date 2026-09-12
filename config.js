// Public browser configuration for JamKar Online.
// This contains only the Supabase project URL and publishable key.
// Never place a secret/service-role key in this file.
window.JAMKAR_CONFIG = {
  supabaseUrl: 'https://qsgczfzqpwwjdfasyywa.supabase.co',
  supabaseKey: 'sb_publishable_VA_OQKV95uApSuCldMMIUg_1r0B8K49'
};

// Production access must come from the server-verified entitlement in Supabase.
// Remove any legacy browser-only demo unlock before app.js initializes.
localStorage.removeItem('jamkar_paid');
