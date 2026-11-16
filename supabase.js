// supabase.js – initialise Supabase client (replace placeholders)
const SUPABASE_URL = 'https://nyvjpkwdxlwozmgxqkpy.supabase.co'; // e.g. https://xyz.supabase.co
const SUPABASE_ANON_KEY = 'sb_publishable_1j0gh-VJq13QjO7JQl4JzQ_Ulu03pYc'; // anon public key

// The Supabase JS SDK is loaded via CDN in the HTML before this script runs
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
