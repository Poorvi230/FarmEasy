// ==========================================================================
// FarmEasy — App Coordinator, Navigation, Theming & Finance Ledger
// ==========================================================================

// 1. Time-of-Day Dynamic Environment Theming
function updateTimeTheme() {
    const hour = new Date().getHours();
    const body = document.body;
    const greeting = document.querySelector('#dashboard-view h2');

    body.classList.remove('theme-afternoon', 'theme-evening', 'theme-night');

    if (hour >= 5 && hour < 12) {
        if (greeting) greeting.innerText = "Morning Brief & Operations";
    } else if (hour >= 12 && hour < 17) {
        body.classList.add('theme-afternoon');
        if (greeting) greeting.innerText = "Noon Field Operations";
    } else if (hour >= 17 && hour < 20) {
        body.classList.add('theme-evening');
        if (greeting) greeting.innerText = "Golden Evening Chores";
    } else {
        body.classList.add('theme-night');
        if (greeting) greeting.innerText = "Night Watch & Security";
    }
}
updateTimeTheme();
setInterval(updateTimeTheme, 60000);

// 2. Global Floating Gamified Feedback
function spawnFloatingText(e, text) {
    if (!e || !e.clientX) return;
    const floater = document.createElement('div');
    floater.className = 'floating-text';
    floater.innerText = text;
    floater.style.left = (e.clientX - 10) + 'px';
    floater.style.top = (e.clientY - 20) + 'px';

    document.body.appendChild(floater);
    setTimeout(() => { floater.remove(); }, 1000);
}
window.spawnFloatingText = spawnFloatingText;

// 3. Top Navigation & Smooth View Transitions
const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('main section');

navButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.classList.contains('active')) return;

        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const contentArea = document.querySelector('.content');
        if (contentArea) {
            contentArea.style.opacity = '0';
            contentArea.style.transform = 'translateX(-15px)';

            setTimeout(() => {
                views.forEach(v => v.classList.add('hidden'));
                const targetId = this.getAttribute('data-target');
                const targetView = document.getElementById(targetId);
                if (targetView) targetView.classList.remove('hidden');
                if (targetId === 'dashboard-view' && window.updateDashboardKPIs) {
                    window.updateDashboardKPIs();
                }

                contentArea.style.transition = 'none';
                contentArea.style.transform = 'translateX(15px)';
                void contentArea.offsetWidth;
                contentArea.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
                contentArea.style.opacity = '1';
                contentArea.style.transform = 'translateX(0)';
            }, 200);
        } else {
            views.forEach(v => v.classList.add('hidden'));
            const targetId = this.getAttribute('data-target');
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.classList.remove('hidden');
            if (targetId === 'dashboard-view' && window.updateDashboardKPIs) {
                window.updateDashboardKPIs();
            }
        }
    });
});

// 4. Ambient Environmental Butterflies / Fireflies
function spawnBugs() {
    const container = document.createElement('div');
    container.id = 'bug-container';
    document.body.appendChild(container);

    const bugCount = 14;
    for (let i = 0; i < bugCount; i++) {
        let bug = document.createElement('div');
        bug.className = 'bug';
        let startX = Math.random() * 100;
        let duration = 25 + Math.random() * 30;
        let delay = Math.random() * -20;
        let drift = (Math.random() * 200 - 100) + 'px';

        bug.style.left = startX + 'vw';
        bug.style.animationDuration = `${duration}s, 3s`;
        bug.style.animationDelay = `${delay}s, ${delay}s`;
        bug.style.setProperty('--drift', drift);

        container.appendChild(bug);
    }
}
spawnBugs();

// 5. Splash Screen Lifecycle
const splash = document.getElementById('splash-screen');
if (splash) {
    let dismissed = false;
    const dismissSplash = () => {
        if (dismissed) return;
        dismissed = true;
        splash.classList.add('fade-out');
        setTimeout(() => splash.remove(), 800);
    };
    splash.addEventListener('click', dismissSplash);
    setTimeout(dismissSplash, 2200);
}

// 6. Financial Ledger System
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
        if (typeof spawnFloatingText === 'function') {
            spawnFloatingText(e, type === 'income' ? `+$${amount.toFixed(0)}` : `-$${amount.toFixed(0)}`);
        }
    });
}
updateFinanceUI();
