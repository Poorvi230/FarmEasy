function updateGreeting() {
    const hour = new Date().getHours();
    const greeting = document.querySelector('#dashboard-view h2');
    if (!greeting) return;
    greeting.innerText = hour < 5 || hour >= 20 ? 'Night' : hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
}
updateGreeting();

const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('main section');

function showView(targetId) {
    views.forEach(v => v.classList.toggle('hidden', v.id !== targetId));
    if (targetId === 'dashboard-view' && window.updateDashboardKPIs) {
        window.updateDashboardKPIs();
    }
    if (targetId === 'assets-view') {
        document.getElementById('asset-overview-grid')?.classList.remove('hidden');
        document.querySelectorAll('.asset-subview').forEach(v => v.classList.add('hidden'));
    }
}

navButtons.forEach(btn => {
    btn.addEventListener('click', function () {
        if (this.classList.contains('active')) return;
        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const targetId = this.getAttribute('data-target');
        const contentArea = document.querySelector('.content');
        if (!contentArea) return showView(targetId);

        contentArea.style.opacity = '0';
        contentArea.style.transform = 'translateX(-15px)';
        setTimeout(() => {
            showView(targetId);
            contentArea.style.transition = 'none';
            contentArea.style.transform = 'translateX(15px)';
            void contentArea.offsetWidth;
            contentArea.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            contentArea.style.opacity = '1';
            contentArea.style.transform = 'translateX(0)';
        }, 200);
    });
});

const defaultTransactions = [
    { id: 1, type: 'income', amount: 480.00, desc: 'Sold 60 Gal Raw Milk', date: new Date().toISOString() },
    { id: 2, type: 'expense', amount: 120.00, desc: 'Diesel Fuel for Tractor Fleet', date: new Date().toISOString() }
];
let transactions;
try {
    transactions = JSON.parse(localStorage.getItem('farmeasy_finances'));
    if (!Array.isArray(transactions)) transactions = defaultTransactions;
} catch (e) { transactions = defaultTransactions; }

function updateFinanceUI() {
    const list = document.getElementById('transaction-history');
    const balanceTxt = document.getElementById('net-balance-text');
    const incomeTxt = document.getElementById('total-income-text');
    const expenseTxt = document.getElementById('total-expense-text');

    if (!list) return;
    list.innerHTML = '';
    let totalIncome = 0;
    let totalExpense = 0;

    if (transactions.length === 0) {
        list.innerHTML = '<p class="empty-board-msg">No transactions logged yet.</p>';
    }
    const sorted = [...transactions].reverse();

    sorted.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        if (t.type === 'expense') totalExpense += t.amount;

        const div = document.createElement('div');
        div.className = `transaction-item ${t.type}`;
        div.innerHTML = `
            <div class="trans-info">
                <strong>${esc(t.desc)}</strong>
                <small>${new Date(t.date).toLocaleDateString()}</small>
            </div>
            <div class="trans-amount-text">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </div>
            <button class="trans-del-btn" data-id="${t.id}" title="Delete" aria-label="Delete transaction">&times;</button>
        `;
        list.appendChild(div);
    });

    const net = totalIncome - totalExpense;
    if (incomeTxt) incomeTxt.innerText = `+$${totalIncome.toFixed(2)}`;
    if (expenseTxt) expenseTxt.innerText = `-$${totalExpense.toFixed(2)}`;
    if (balanceTxt) {
        balanceTxt.innerText = `${net >= 0 ? '+' : '-'}$${Math.abs(net).toFixed(2)}`;
        balanceTxt.style.color = net >= 0 ? '#699b4f' : '#d9534f';
    }
}

const transList = document.getElementById('transaction-history');
if (transList) {
    transList.addEventListener('click', (e) => {
        const btn = e.target.closest('.trans-del-btn');
        if (!btn) return;
        transactions = transactions.filter(t => String(t.id) !== btn.dataset.id);
        localStorage.setItem('farmeasy_finances', JSON.stringify(transactions));
        updateFinanceUI();
    });
}

const exportCsvBtn = document.getElementById('export-csv-btn');
if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
        const q = v => '"' + String(v).replace(/"/g, '""') + '"';
        const rows = [['date', 'type', 'amount', 'description']].concat(
            transactions.map(t => [t.date.slice(0, 10), t.type, t.amount.toFixed(2), t.desc])
        );
        download('farmeasy-ledger.csv', rows.map(r => r.map(q).join(',')).join('\n'), 'text/csv');
    });
}

const addTransBtn = document.getElementById('add-trans-btn');
if (addTransBtn) {
    addTransBtn.addEventListener('click', (e) => {
        const typeEl = document.getElementById('trans-type');
        const amountEl = document.getElementById('trans-amount');
        const descEl = document.getElementById('trans-desc');

        const type = typeEl ? typeEl.value : 'expense';
        const amount = parseFloat(amountEl ? amountEl.value : 0);
        const desc = descEl ? descEl.value.trim() : '';

        if (!amount || amount <= 0 || !desc) {
            toast("Need an amount and a description");
            return;
        }

        transactions.push({
            id: Date.now(),
            type: type,
            amount: amount,
            desc: desc,
            date: new Date().toISOString()
        });
        localStorage.setItem('farmeasy_finances', JSON.stringify(transactions));

        if (amountEl) amountEl.value = '';
        if (descEl) descEl.value = '';
        updateFinanceUI();
    });
}
updateFinanceUI();
