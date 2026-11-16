// Initialise Supabase client (replace placeholders)
const SUPABASE_URL = 'https://nyvjpkwdxlwozmgxqkpy.supabase.co'; // your Supabase project URL
const SUPABASE_ANON_KEY = 'sb_publishable_1j0gh-VJq13QjO7JQl4JzQ_Ulu03pYc'; // your anon public key

// Create the client using the SDK that was loaded via CDN
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// expose globally so other scripts can use `supabase`
window.supabase = supabaseClient;
var supabase = supabaseClient;
