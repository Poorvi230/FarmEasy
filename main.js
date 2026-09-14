const navButtons = document.querySelectorAll('.nav-btn');
let views = document.querySelectorAll('main section');

navButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        console.log("clicked a button", e.target.innerText)
        navButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        views.forEach(v => {
            v.classList.add('hidden');
        });
        let targetId = this.getAttribute('data-target');
        let targetView = document.getElementById(targetId);

        targetView.classList.remove('hidden');
    });
});