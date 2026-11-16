// Initialise the public browser client. Keep this key public; Supabase RLS
// policies are what protect each user's rows.
const SUPABASE_URL = 'https://nyvjpkwdxlwozmgxqkpy.supabase.co'; // your Supabase project URL
const SUPABASE_ANON_KEY = 'sb_publishable_1j0gh-VJq13QjO7JQl4JzQ_Ulu03pYc'; // your anon public key

// Replace the CDN namespace with the authenticated client. Every page loads the
// SDK before this file, so subsequent scripts can safely use `supabase`.
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
