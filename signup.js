const signupForm = document.getElementById('signup-form');
const signupMessage = document.getElementById('msg');
function showSignupMessage(text, error = false) { signupMessage.textContent = text; signupMessage.className = `message ${error ? 'error' : 'success'}`; }
signupForm.addEventListener('submit', async event => {
  event.preventDefault(); const email = document.getElementById('email').value.trim(); const password = document.getElementById('password').value; const confirmation = document.getElementById('confirm-password').value; const button = document.getElementById('btn-signup');
  if (password.length < 6) return showSignupMessage('Use a password with at least 6 characters.', true);
  if (password !== confirmation) return showSignupMessage('Passwords do not match.', true);
  button.disabled = true; button.textContent = 'Creating account…';
  const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}${window.location.pathname.replace('signup.html', 'index.html')}` } });
  button.disabled = false; button.textContent = 'Create account';
  if (error) return showSignupMessage(error.message, true);
  showSignupMessage(data.session ? 'Account created. Taking you to your dashboard…' : 'Account created. Check your email to verify it, then sign in.');
  if (data.session) setTimeout(() => window.location.assign('dashboard.html'), 700);
});
