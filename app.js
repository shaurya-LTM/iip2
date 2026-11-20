const storageKey = 'expense-tracker-transactions';
let transactions = loadTransactions();

const form = document.getElementById('transaction-form');
const tableBody = document.querySelector('#transactions-table tbody');

document.getElementById('date').value = today();
form.addEventListener('submit', saveTransaction);
document.getElementById('cancel-button').addEventListener('click', clearForm);
document.getElementById('clear-button').addEventListener('click', clearAll);

drawPage();

function loadTransactions() {
  const savedData = localStorage.getItem(storageKey);
  return savedData ? JSON.parse(savedData) : [];
}

function saveToBrowser() {
  localStorage.setItem(storageKey, JSON.stringify(transactions));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
}

function saveTransaction(event) {
  event.preventDefault();

  const id = document.getElementById('edit-id').value;
  const transaction = {
    id: id || String(Date.now()),
    type: document.getElementById('type').value,
    date: document.getElementById('date').value,
    amount: Number(document.getElementById('amount').value),
    category: document.getElementById('category').value.trim(),
    notes: document.getElementById('notes').value.trim()
  };

  if (!transaction.date || !transaction.category || transaction.amount <= 0) return;

  if (id) {
    const index = transactions.findIndex(function (item) { return item.id === id; });
    transactions[index] = transaction;
  } else {
    transactions.push(transaction);
  }

  saveToBrowser();
  clearForm();
  drawPage();
}

function editTransaction(id) {
  const transaction = transactions.find(function (item) { return item.id === id; });
  if (!transaction) return;

  document.getElementById('edit-id').value = transaction.id;
  document.getElementById('type').value = transaction.type;
  document.getElementById('date').value = transaction.date;
  document.getElementById('amount').value = transaction.amount;
  document.getElementById('category').value = transaction.category;
  document.getElementById('notes').value = transaction.notes;
  document.getElementById('form-title').textContent = 'Edit transaction';
  document.getElementById('save-button').textContent = 'Save changes';
  document.getElementById('cancel-button').classList.remove('hidden');
}

function deleteTransaction(id) {
  if (!confirm('Delete this transaction?')) return;
  transactions = transactions.filter(function (item) { return item.id !== id; });
  saveToBrowser();
  drawPage();
}

function clearForm() {
  form.reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('date').value = today();
  document.getElementById('form-title').textContent = 'Add transaction';
  document.getElementById('save-button').textContent = 'Add transaction';
  document.getElementById('cancel-button').classList.add('hidden');
}

function clearAll() {
  if (!transactions.length || !confirm('Delete all transactions?')) return;
  transactions = [];
  saveToBrowser();
  clearForm();
  drawPage();
}

function drawPage() {
  let income = 0;
  let expenses = 0;

  tableBody.innerHTML = '';
  transactions.sort(function (first, second) { return second.date.localeCompare(first.date); });

  transactions.forEach(function (transaction) {
    if (transaction.type === 'income') income += transaction.amount;
    else expenses += transaction.amount;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.date}</td>
      <td>${transaction.type}</td>
      <td>${transaction.category}</td>
      <td>${formatMoney(transaction.amount)}</td>
      <td>${transaction.notes || ''}</td>
      <td><button data-edit="${transaction.id}">Edit</button><button class="danger" data-delete="${transaction.id}">Delete</button></td>`;
    tableBody.appendChild(row);
  });

  document.getElementById('income-total').textContent = formatMoney(income);
  document.getElementById('expense-total').textContent = formatMoney(expenses);
  document.getElementById('balance-total').textContent = formatMoney(income - expenses);
  document.getElementById('transactions-table').classList.toggle('hidden', transactions.length === 0);
  document.getElementById('empty-message').classList.toggle('hidden', transactions.length !== 0);

  document.querySelectorAll('[data-edit]').forEach(function (button) {
    button.addEventListener('click', function () { editTransaction(button.dataset.edit); });
  });

  document.querySelectorAll('[data-delete]').forEach(function (button) {
    button.addEventListener('click', function () { deleteTransaction(button.dataset.delete); });
  });
}
