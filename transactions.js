// transactions.js – CRUD helpers + quick‑scan (vanilla JS)

// Helper for formatting numbers
const fmt = n => Number(n).toLocaleString(undefined, {minimumFractionDigits:2});

// Initialise app: ensure user is logged in, load UI
async function init() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return (window.location = 'index.html');
  document.getElementById('username').textContent = user.email;
  await loadTransactions();
  await setupCamera();
}
init();

// Load all transactions for current user
async function loadTransactions() {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false });
  if (error) return console.error(error);
  renderTable(data);
  updateSummary(data);
}

// Render the transaction table
function renderTable(rows) {
  const tbody = document.querySelector('#tx-table tbody');
  tbody.innerHTML = '';
  rows.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.date}</td>
      <td>${r.type}</td>
      <td>${r.category}</td>
      <td>${fmt(r.amount)}</td>
      <td>${r.description || ''}</td>
      <td><button data-id="${r.id}" class="del">✕</button></td>
    `;
    tbody.appendChild(tr);
  });
  // Delete handler
  tbody.querySelectorAll('.del').forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      await supabase.from('transactions').delete().eq('id', id);
      await loadTransactions();
    };
  });
}

// Update income / expense / balance summary
function updateSummary(rows) {
  let inc = 0, exp = 0;
  rows.forEach(r => {
    if (r.type === 'income') inc += Number(r.amount);
    else exp += Number(r.amount);
  });
  document.getElementById('total-income').textContent = fmt(inc);
  document.getElementById('total-expense').textContent = fmt(exp);
  document.getElementById('balance').textContent = fmt(inc - exp);
}

// Add a new transaction from the form
document.getElementById('btn-add').onclick = async () => {
  const type = document.getElementById('type').value;
  const date = document.getElementById('date').value;
  const amount = document.getElementById('amount').value;
  const category = document.getElementById('category').value.trim() || 'Uncategorized';
  const description = document.getElementById('desc').value.trim();

  if (!date || !amount) return alert('Date and amount are required');

  await supabase.from('transactions').insert([{
    type,
    date,
    amount: Number(amount),
    category,
    description,
    user_id: supabase.auth.user().id
  }]);

  // clear form
  document.getElementById('date').value = '';
  document.getElementById('amount').value = '';
  document.getElementById('category').value = '';
  document.getElementById('desc').value = '';

  await loadTransactions();
};

// ----- Quick‑scan (camera + OCR) -----
let videoStream = null;
async function setupCamera() {
  const cam = document.getElementById('cam');
  videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
  cam.srcObject = videoStream;
}

document.getElementById('btn-scan').onclick = async () => {
  const cam = document.getElementById('cam');
  const canvas = document.createElement('canvas');
  canvas.width = cam.videoWidth;
  canvas.height = cam.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(cam, 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL('image/png');
  document.getElementById('scan-msg').textContent = 'Scanning…';

  const { data: { text } } = await Tesseract.recognize(dataURL, 'eng', { logger: m => console.log(m) });
  // Very simple parsing – first number looks like amount, first date‑like string
  const amountMatch = text.match(/(\d+[.,]\d{2})/);
  const dateMatch = text.match(/(\d{2}[\/\-]\d{2}[\/\-]\d{4})/);
  const amount = amountMatch ? amountMatch[1].replace(',', '.') : null;
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().slice(0,10);

  if (!amount) {
    document.getElementById('scan-msg').textContent = 'Could not read amount – try again.';
    return;
  }

  await supabase.from('transactions').insert([{
    type: 'expense',
    date,
    amount: Number(amount),
    category: 'Scanned',
    description: 'Scanned receipt',
    user_id: supabase.auth.user().id
  }]);

  document.getElementById('scan-msg').textContent = `Added ${fmt(amount)} on ${date}`;
  await loadTransactions();
};

// Logout helper
async function logout() {
  await supabase.auth.signOut();
  window.location = 'index.html';
}
