const navButtons = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('main section');

navButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        views.forEach(v => {
            v.classList.add('hidden');
        });
        const targetId = this.getAttribute('data-target');
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.remove('hidden');
        }
    });
});

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