const SPRAY_KEY = 'farmeasy_spray_log';
let sprayLog;
try {
    sprayLog = JSON.parse(localStorage.getItem(SPRAY_KEY));
    if (!Array.isArray(sprayLog)) sprayLog = [];
} catch (e) { sprayLog = []; }

const sprayField = document.getElementById('spray-field');
const sprayProduct = document.getElementById('spray-product');
const sprayList = document.getElementById('spray-log-list');

function fillSprayFields() {
    if (!sprayField) return;
    let names = [];
    try { names = JSON.parse(localStorage.getItem('farmeasy_field_parcels')).map(p => p.name); } catch (e) {}
    if (!names.length && typeof fieldParcels !== 'undefined') names = fieldParcels.map(p => p.name);
    sprayField.innerHTML = names.map(n => `<option>${esc(n)}</option>`).join('');
}

function renderSprayLog() {
    if (!sprayList) return;
    if (!sprayLog.length) {
        sprayList.innerHTML = '<li class="spray-empty">Nothing logged yet.</li>';
        return;
    }
    sprayList.innerHTML = sprayLog.slice(-6).reverse().map(e => `
        <li>
            <span><strong>${esc(e.field)}</strong> &middot; ${esc(e.product)}</span>
            <small>${new Date(e.date).toLocaleDateString()} &middot; wind ${esc(e.wind)}</small>
            <button class="trans-del-btn" data-id="${e.id}" aria-label="Delete entry">&times;</button>
        </li>`).join('');
}

document.getElementById('spray-log-btn')?.addEventListener('click', () => {
    const product = sprayProduct.value.trim();
    if (!product || !sprayField.value) return toast('Pick a field and enter a product');
    const wind = document.getElementById('weather-wind-val')?.textContent.trim() || 'n/a';
    sprayLog.push({ id: Date.now(), date: new Date().toISOString(), field: sprayField.value, product, wind });
    localStorage.setItem(SPRAY_KEY, JSON.stringify(sprayLog));
    sprayProduct.value = '';
    renderSprayLog();
    const badge = document.getElementById('spray-window-badge');
    if (badge && badge.classList.contains('danger')) toast('Logged. Note: advisor says conditions were bad');
});

sprayList?.addEventListener('click', e => {
    const btn = e.target.closest('.trans-del-btn');
    if (!btn) return;
    sprayLog = sprayLog.filter(x => String(x.id) !== btn.dataset.id);
    localStorage.setItem(SPRAY_KEY, JSON.stringify(sprayLog));
    renderSprayLog();
});

fillSprayFields();
renderSprayLog();
