document.getElementById('backup-btn')?.addEventListener('click', () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('farmeasy_')) data[k] = localStorage.getItem(k);
    }
    const stamp = new Date().toISOString().slice(0, 10);
    download(`farmeasy-backup-${stamp}.json`, JSON.stringify(data, null, 2), 'application/json');
});

const restoreFile = document.getElementById('restore-file');
document.getElementById('restore-btn')?.addEventListener('click', () => restoreFile.click());
restoreFile?.addEventListener('change', async () => {
    const file = restoreFile.files[0];
    restoreFile.value = '';
    if (!file) return;
    try {
        const data = JSON.parse(await file.text());
        const keys = Object.keys(data).filter(k => k.startsWith('farmeasy_'));
        if (!keys.length) throw new Error('no farm data');
        if (!confirm(`Replace current data with this backup (${keys.length} items)?`)) return;
        keys.forEach(k => localStorage.setItem(k, data[k]));
        location.reload();
    } catch (e) {
        toast("That file isn't a FarmEasy backup");
    }
});

window.refreshToday = function () {
    const el = document.getElementById('today-line');
    if (!el) return;
    let left = 0, net = 0;
    try {
        left = JSON.parse(localStorage.getItem('farmeasy_chores') || '[]').filter(c => !c.completed).length;
        const m = new Date().toISOString().slice(0, 7);
        JSON.parse(localStorage.getItem('farmeasy_finances') || '[]').forEach(t => {
            if (t.date.startsWith(m)) net += t.type === 'income' ? t.amount : -t.amount;
        });
    } catch (e) {}
    const date = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
    el.textContent = `${date} · ${left} chore${left === 1 ? '' : 's'} left · ${net < 0 ? '-' : ''}$${Math.abs(net).toFixed(0)} this month`;
};
window.refreshToday();
const _kpi = window.updateDashboardKPIs;
window.updateDashboardKPIs = function () { _kpi?.apply(this, arguments); window.refreshToday(); };
