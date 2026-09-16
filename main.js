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

const alertBtn = document.querySelector('.alert-card .btn-primary');
if(alertBtn) {
    alertBtn.addEventListener('click', function() {
        const card = this.closest('.alert-card');

        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';

        setTimeout(() => {
            card.remove();
        }, 300);
    });
}
//new chore add
const addChoreBtn = document.querySelector('#tasks-view .btn-primary');
const taskList = document.querySelector('.task-list');

const modalOverlay = document.getElementById('chore-modal');
const choreInput = document.getElementById('new-chore-input');
const saveBtn = document.getElementById('save-chore-btn');
const cancelBtn = document.getElementById('cancel-chore-btn');

if(addChoreBtn) {
    addChoreBtn.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        choreInput.value = '';
        choreInput.focus();
    });
}
if(cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
}
if(saveBtn && taskList) {
      saveBtn.addEventListener('click', () => {
        let newChore = choreInput.value;

        if(newChore.trim() !== "") {
          const newTaskHTML = `
            <label class="task-item" style="animation: popIn 0.3s ease-out;">
              <input type="checkbox">
              <span class="task-text">${newChore}</span>
              <span class="task-tag">New 🌱</span>
            </label>
          `;

          taskList.insertAdjacentHTML('beforeend', newTaskHTML);
          modalOverlay.classList.add('hidden');
        }
      });
    }