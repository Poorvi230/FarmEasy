const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('main section');

navButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetId = this.getAttribute('data-target');
        if (!targetId) return;

        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        views.forEach(v => {
            if (v.id === targetId) {
                v.classList.remove('hidden');
            } else {
                v.classList.add('hidden');
            }
        });

        // When opening Assets view, ensure the main overview grid is visible
        if (targetId === 'assets-view') {
            const overviewGrid = document.getElementById('asset-overview-grid');
            const assetSubViews = document.querySelectorAll('.asset-subview');
            if (overviewGrid) overviewGrid.classList.remove('hidden');
            if (assetSubViews) assetSubViews.forEach(v => v.classList.add('hidden'));
        }
    });
});

let transactions = JSON.parse(localStorage.getItem('farmeasy_finances')) || [
    { id: 1, type: 'income', amount: 480.00, desc: 'Sold 60 Gal Raw Milk', date: new Date().toISOString() },
    { id: 2, type: 'expense', amount: 120.00, desc: 'Diesel Fuel for Tractor Fleet', date: new Date().toISOString() }
];

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
                <strong>${t.desc}</strong>
                <small>${new Date(t.date).toLocaleDateString()}</small>
            </div>
            <div class="trans-amount-text">
                ${t.type === 'income' ? '+' : '-'}$${t.amount.toFixed(2)}
            </div>
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
            alert("Please enter a valid amount and description!");
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
