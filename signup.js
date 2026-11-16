// signup.js – create a new user via Supabase Auth (email & password)

const msg = document.getElementById('msg');

document.getElementById('btn-signup').onclick = async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password) return setMsg('Email and password required');

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return setMsg(error.message);

  setMsg('Account created! Check your email for a confirmation link.');
  // After a short pause, redirect to login page
  setTimeout(() => (window.location = 'index.html'), 3000);
};

function setMsg(text) { msg.textContent = text; }
