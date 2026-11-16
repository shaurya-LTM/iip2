// auth.js – simple email → password flow (no passkey)
// Elements
const stepEmail = document.getElementById('step-email');
const stepPass = document.getElementById('step-pass');
const msg = document.getElementById('msg');
let userEmail = null;

// Email step
document.getElementById('btn-email').onclick = () => {
  userEmail = document.getElementById('email').value.trim();
  if (!userEmail) return setMsg('Enter a valid email');
  stepEmail.style.display = 'none';
  stepPass.style.display = 'block';
};

// Password step – uses the global `supabase` client
document.getElementById('btn-pass').onclick = async () => {
  const password = document.getElementById('password').value;
  if (!password) return setMsg('Enter a password');

  const { error } = await supabase.auth.signInWithPassword({ email: userEmail, password });
  if (error) return setMsg(error.message);

  // Success – go directly to the dashboard
  window.location.href = 'dashboard.html';
};

// No passkey UI in this demo – the step-passkey div only shows a note.

function setMsg(text) { msg.textContent = text; }
