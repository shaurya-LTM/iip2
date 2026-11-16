const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('msg');
function showLoginMessage(text, error = false) { loginMessage.textContent = text; loginMessage.className = `message ${error ? 'error' : 'success'}`; }
supabase.auth.getSession().then(({ data }) => { if (data.session) window.location.replace('dashboard.html'); });
loginForm.addEventListener('submit', async event => {
  event.preventDefault(); const email = document.getElementById('email').value.trim(); const password = document.getElementById('password').value; const button = document.getElementById('btn-login');
  if (!email || !password) return showLoginMessage('Enter your email and password.', true);
  button.disabled = true; button.textContent = 'Signing in…';
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  button.disabled = false; button.textContent = 'Sign in';
  if (error) return showLoginMessage(error.message, true);
  window.location.assign('dashboard.html');
});
