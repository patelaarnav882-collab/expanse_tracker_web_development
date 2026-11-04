// --- State ---
let expenses = [];
let currentFilter = 'All';
let currentCurrency = '₹';
let monthlyBudget = 5000;

// Category styling & icons
const categoryConfig = {
  Food: {
    badge: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    bar: 'bg-amber-400',
    dot: 'bg-amber-400',
    icon: '🍔'
  },
  Transport: {
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    bar: 'bg-blue-500',
    dot: 'bg-blue-500',
    icon: '🚗'
  },
  Utilities: {
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    icon: '💡'
  },
  Entertainment: {
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    bar: 'bg-purple-500',
    dot: 'bg-purple-500',
    icon: '🎬'
  },
  Other: {
    badge: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600',
    bar: 'bg-slate-400',
    dot: 'bg-slate-400',
    icon: '📦'
  }
};

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const nameInput = document.getElementById('expense-name');
const amountInput = document.getElementById('expense-amount');
const amountLabel = document.getElementById('amount-label');
const categorySelect = document.getElementById('expense-category');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');
const totalLabel = document.getElementById('total-label');
const expenseCount = document.getElementById('expense-count');
const filterButtons = document.querySelectorAll('.filter-btn');
const breakdownBar = document.getElementById('breakdown-bar');
const breakdownLegend = document.getElementById('breakdown-legend');
const breakdownSubtitle = document.getElementById('breakdown-subtitle');
const exportBtn = document.getElementById('export-btn');
const clearBtn = document.getElementById('clear-btn');
const confirmModal = document.getElementById('confirm-modal');
const cancelClearBtn = document.getElementById('cancel-clear-btn');
const confirmClearBtn = document.getElementById('confirm-clear-btn');
const currencySelect = document.getElementById('currency-select');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const editBudgetBtn = document.getElementById('edit-budget-btn');
const budgetInputContainer = document.getElementById('budget-input-container');
const budgetInput = document.getElementById('budget-input');
const saveBudgetBtn = document.getElementById('save-budget-btn');
const budgetRatioText = document.getElementById('budget-ratio-text');
const budgetProgressBar = document.getElementById('budget-progress-bar');
const budgetAlert = document.getElementById('budget-alert');
const budgetAlertIcon = document.getElementById('budget-alert-icon');
const budgetAlertMsg = document.getElementById('budget-alert-msg');

// --- Currency Helper ---
function formatCurrency(amount) {
  return `${currentCurrency}${amount.toFixed(2)}`;
}

// --- Local Storage Helpers ---
function saveExpenses() {
  try {
    localStorage.setItem('my_expenses_data', JSON.stringify(expenses));
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

function saveSettings() {
  try {
    localStorage.setItem('my_expenses_currency', currentCurrency);
    localStorage.setItem('my_expenses_budget', monthlyBudget.toString());
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
}

function loadState() {
  try {
    const savedExpenses = localStorage.getItem('my_expenses_data');
    if (savedExpenses) expenses = JSON.parse(savedExpenses);

    const savedCurrency = localStorage.getItem('my_expenses_currency');
    if (savedCurrency) {
      currentCurrency = savedCurrency;
      currencySelect.value = savedCurrency;
    }

    const savedBudget = localStorage.getItem('my_expenses_budget');
    if (savedBudget) monthlyBudget = parseFloat(savedBudget) || 5000;

    const savedTheme = localStorage.getItem('my_expenses_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      document.documentElement.classList.remove('dark');
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
  amountLabel.textContent = `Amount (${currentCurrency})`;
  budgetInput.value = monthlyBudget;
}

// --- Dark Mode Handler ---
themeToggleBtn.addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  if (isDark) {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
  try {
    localStorage.setItem('my_expenses_theme', isDark ? 'dark' : 'light');
  } catch (err) {
    console.warn('LocalStorage error:', err);
  }
});

// --- Currency Change Handler ---
currencySelect.addEventListener('change', (e) => {
  currentCurrency = e.target.value;
  amountLabel.textContent = `Amount (${currentCurrency})`;
  saveSettings();
  renderExpenses();
  updateTotalAndBreakdown();
});

// --- Budget Handlers ---
editBudgetBtn.addEventListener('click', () => {
  budgetInputContainer.classList.toggle('hidden');
  if (!budgetInputContainer.classList.contains('hidden')) {
    budgetInput.focus();
  }
});

saveBudgetBtn.addEventListener('click', () => {
  const val = parseFloat(budgetInput.value);
  if (!isNaN(val) && val > 0) {
    monthlyBudget = val;
    saveSettings();
    budgetInputContainer.classList.add('hidden');
    updateTotalAndBreakdown();
  }
});

// --- Calculation & Rendering ---
function getFilteredExpenses() {
  if (currentFilter === 'All') return expenses;
  return expenses.filter(item => item.category === currentFilter);
}

function updateTotalAndBreakdown() {
  const filtered = getFilteredExpenses();
  const sum = filtered.reduce((accumulator, item) => accumulator + item.amount, 0);

  totalAmount.textContent = formatCurrency(sum);
  totalLabel.textContent = currentFilter === 'All' ? 'Total Spent' : `Total Spent (${currentFilter})`;
  expenseCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;

  const overallTotal = expenses.reduce((acc, item) => acc + item.amount, 0);

  // --- Budget Progress & Alerts ---
  const budgetPercentage = monthlyBudget > 0 ? (overallTotal / monthlyBudget) * 100 : 0;
  budgetRatioText.textContent = `Spent ${formatCurrency(overallTotal)} of ${formatCurrency(monthlyBudget)}`;
  
  const clampedBarWidth = Math.min(budgetPercentage, 100);
  budgetProgressBar.style.width = `${clampedBarWidth}%`;

  if (budgetPercentage >= 100) {
    budgetProgressBar.className = 'h-full bg-rose-600 transition-all duration-300';
    budgetAlert.className = 'mt-2.5 rounded-lg p-2.5 text-xs font-medium flex items-center gap-2 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300';
    budgetAlertIcon.textContent = '🚨';
    const overspent = overallTotal - monthlyBudget;
    budgetAlertMsg.textContent = `Budget exceeded by ${formatCurrency(overspent)} (${budgetPercentage.toFixed(0)}% used)!`;
    budgetAlert.classList.remove('hidden');
  } else if (budgetPercentage >= 80) {
    budgetProgressBar.className = 'h-full bg-amber-500 transition-all duration-300';
    budgetAlert.className = 'mt-2.5 rounded-lg p-2.5 text-xs font-medium flex items-center gap-2 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300';
    budgetAlertIcon.textContent = '⚠️';
    budgetAlertMsg.textContent = `Caution: You've used ${budgetPercentage.toFixed(0)}% of your monthly budget.`;
    budgetAlert.classList.remove('hidden');
  } else {
    budgetProgressBar.className = 'h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300';
    budgetAlert.classList.add('hidden');
  }

  // --- Breakdown Bar & Legend ---
  if (overallTotal === 0) {
    breakdownSubtitle.textContent = '0%';
    breakdownBar.innerHTML = '<div class="w-full h-full bg-slate-200 dark:bg-slate-700"></div>';
    breakdownLegend.innerHTML = '<span class="text-slate-400">Add expenses to see category breakdown.</span>';
    return;
  }

  breakdownSubtitle.textContent = `${expenses.length} total entries`;

  const categoryTotals = {};
  expenses.forEach(item => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  breakdownBar.innerHTML = '';
  breakdownLegend.innerHTML = '';

  Object.entries(categoryTotals).forEach(([cat, catSum]) => {
    const percentage = (catSum / overallTotal) * 100;
    const config = categoryConfig[cat] || categoryConfig.Other;

    const segment = document.createElement('div');
    segment.style.width = `${percentage}%`;
    segment.className = `h-full ${config.bar} transition-all duration-300`;
    segment.title = `${cat}: ${formatCurrency(catSum)} (${percentage.toFixed(0)}%)`;
    breakdownBar.appendChild(segment);

    const legendItem = document.createElement('span');
    legendItem.className = 'inline-flex items-center gap-1';
    legendItem.innerHTML = `
      <span class="w-2 h-2 rounded-full ${config.dot}"></span>
      <span class="font-medium">${config.icon} ${cat}</span>
      <span class="text-slate-400 dark:text-slate-400">(${percentage.toFixed(0)}%)</span>
    `;
    breakdownLegend.appendChild(legendItem);
  });
}

function deleteExpense(id) {
  expenses = expenses.filter(item => item.id !== id);
  saveExpenses();
  renderExpenses();
  updateTotalAndBreakdown();
}

function renderExpenses() {
  expenseList.innerHTML = '';
  const filtered = getFilteredExpenses();

  if (filtered.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.id = 'empty-state';
    emptyLi.className = 'py-8 text-center text-sm text-slate-400 dark:text-slate-500';
    emptyLi.textContent = currentFilter === 'All' 
      ? 'No expenses added yet. Add one above!' 
      : `No expenses found in ${currentFilter}.`;
    expenseList.appendChild(emptyLi);
    return;
  }

  filtered.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'py-3 flex justify-between items-center text-sm';

    // Left container
    const leftDiv = document.createElement('div');
    leftDiv.className = 'flex flex-col gap-1';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'font-medium text-slate-800 dark:text-slate-200';
    nameSpan.textContent = item.name;

    const badge = document.createElement('span');
    const config = categoryConfig[item.category] || categoryConfig.Other;
    badge.className = `inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border w-fit ${config.badge}`;
    badge.textContent = `${config.icon} ${item.category}`;

    leftDiv.appendChild(nameSpan);
    leftDiv.appendChild(badge);

    // Right container
    const rightDiv = document.createElement('div');
    rightDiv.className = 'flex items-center gap-3';

    const amountSpan = document.createElement('span');
    amountSpan.className = 'font-semibold text-slate-900 dark:text-white';
    amountSpan.textContent = formatCurrency(item.amount);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors';
    deleteBtn.title = 'Delete expense';
    deleteBtn.setAttribute('aria-label', `Delete ${item.name}`);
    deleteBtn.innerHTML = `
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    `;
    deleteBtn.addEventListener('click', () => deleteExpense(item.id));

    rightDiv.appendChild(amountSpan);
    rightDiv.appendChild(deleteBtn);

    li.appendChild(leftDiv);
    li.appendChild(rightDiv);
    expenseList.appendChild(li);
  });
}

// --- Export to CSV Function ---
exportBtn.addEventListener('click', () => {
  if (expenses.length === 0) return;

  const headers = ['ID', 'Date', 'Name', 'Category', `Amount (${currentCurrency})`];
  const rows = expenses.map(item => {
    const dateStr = new Date(item.id).toLocaleDateString();
    const safeName = `"${item.name.replace(/"/g, '""')}"`;
    return [item.id, dateStr, safeName, item.category, item.amount.toFixed(2)].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
});

// --- Clear All Handlers ---
clearBtn.addEventListener('click', () => {
  if (expenses.length > 0) {
    confirmModal.classList.remove('hidden');
  }
});

cancelClearBtn.addEventListener('click', () => {
  confirmModal.classList.add('hidden');
});

confirmClearBtn.addEventListener('click', () => {
  expenses = [];
  saveExpenses();
  renderExpenses();
  updateTotalAndBreakdown();
  confirmModal.classList.add('hidden');
});

// --- Filter Buttons ---
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;

    filterButtons.forEach((b) => {
      if (b.dataset.filter === currentFilter) {
        b.className = 'filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-indigo-600 text-white shadow-sm';
      } else {
        b.className = 'filter-btn px-3 py-1.5 rounded-full text-xs font-medium transition-colors bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600';
      }
    });

    renderExpenses();
    updateTotalAndBreakdown();
  });
});

// --- Form Submission ---
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  if (!name || isNaN(amount) || amount <= 0) return;

  expenses.push({ 
    id: Date.now(), 
    name, 
    amount, 
    category 
  });

  saveExpenses();
  renderExpenses();
  updateTotalAndBreakdown();

  nameInput.value = '';
  amountInput.value = '';
  categorySelect.value = 'Food';
  nameInput.focus();
});

// --- App Initialization ---
loadState();
renderExpenses();
updateTotalAndBreakdown();
