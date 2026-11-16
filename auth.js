// auth.js – email → password → passkey (WebAuthn) flow (basic, no frameworks)
// Elements
const stepEmail = document.getElementById('step-email');
const stepPass = document.getElementById('step-pass');
const stepPasskey = document.getElementById('step-passkey');
const msg = document.getElementById('msg');
let userEmail = null;

// Email step
document.getElementById('btn-email').onclick = async () => {
  userEmail = document.getElementById('email').value.trim();
  if (!userEmail) return setMsg('Enter a valid email');
  stepEmail.style.display = 'none';
  stepPass.style.display = 'block';
};

// Password step
document.getElementById('btn-pass').onclick = async () => {
  const password = document.getElementById('password').value;
  if (!password) return setMsg('Enter a password');

  const { error } = await supabase.auth.signInWithPassword({ email: userEmail, password });
  if (error) return setMsg(error.message);

  stepPass.style.display = 'none';
  stepPasskey.style.display = 'block';
};

// Passkey step (WebAuthn)
document.getElementById('btn-passkey').onclick = async () => {
  // 1️⃣ Ask Supabase Edge Function for a challenge (you must create it later)
  const { data: challenge, error: chErr } = await supabase.functions.invoke('webauthn-challenge', {
    body: JSON.stringify({ email: userEmail })
  });
  if (chErr) return setMsg('Passkey challenge failed');

  const publicKey = JSON.parse(challenge);
  const assertion = await navigator.credentials.get({ publicKey });

  // Helper to base64‑encode ArrayBuffer
  const b2a = buf => btoa(String.fromCharCode(...new Uint8Array(buf)));

  const credential = {
    id: assertion.id,
    rawId: b2a(assertion.rawId),
    type: assertion.type,
    response: {
      authenticatorData: b2a(assertion.response.authenticatorData),
      clientDataJSON: b2a(assertion.response.clientDataJSON),
      signature: b2a(assertion.response.signature),
      userHandle: b2a(assertion.response.userHandle)
    }
  };

  // 2️⃣ Verify with Supabase Edge Function
  const { error: verifyErr } = await supabase.functions.invoke('webauthn-verify', {
    body: JSON.stringify({ credential, email: userEmail })
  });
  if (verifyErr) return setMsg('Passkey verification failed');

  // ✅ All good – go to the app
  window.location.href = 'dashboard.html';
};

function setMsg(text) { msg.textContent = text; }
