const defaultChores = [
    { id: 1, text: "Feed the chickens", tag: "Morning", completed: false},
    { id: 2, text: "Check east fence", tag: "Urgent", completed: true},
    { id: 3, text: "Water tomato sprouts", tag: "Afternoon", completed: false}
];

let chores = JSON.parse(localStorage.getItem('farmeasy_chores')) || defaultChores;
let activeFilter = 'all';

const taskBoard = document.getElementById('task-board-container');
const modalOverlay = document.getElementById('chore-modal');
const choreInput = document.getElementById('new-chore-input');
const choreTagSelect = document.getElementById('chore-tag-select');
const openModalBtn = document.getElementById('open-chore-modal-btn');
const saveBtn = document.getElementById('save-chore-btn');
const cancelBtn = document.getElementById('cancel-chore-btn');
const filterButtons = document.querySelectorAll('.filter-btn');

function saveChoresToStorage() {
    localStorage.setItem('farmeasy_chores', JSON.stringify(chores));
}

function renderChores() {
    if (!taskBoard) return;
    taskBoard.innerHTML = '';

    const filtered = chores.filter(chore => {
        if (activeFilter === 'pending') return !chore.completed;
        if (activeFilter === 'completed') return chore.completed;
        if (activeFilter.toLowerCase() === 'urgent') return chore.tag.toLowerCase() === 'urgent';
        return true;
    });

    if (filtered.length === 0) {
        taskBoard.innerHTML = `<p class="empty-board-msg">No chores found here! Grab a cold lemonade 🍋</p>`; 
        return;
    }

    filtered.forEach(chore => {
        const isUrgent = chore.tag.toLowerCase() === 'urgent';
        const card = document.createElement('div');
        card.className = 'task-item';
        card.dataset.id = chore.id;
        card.innerHTML = `                                                                                                                                                                                         
                <button class="task-delete-btn" title="Delete chore">✖</button>                                                                                                                                        
                <span class="task-text">${chore.text}</span>                                                                                                                                                           
                <span class="task-tag ${isUrgent ? 'urgent' : ''}">${chore.tag}</span>                                                                                                                                 
                <input type="checkbox" class="task-check" ${chore.completed ? 'checked' : ''}>                                                                                                                         
            `;
        taskBoard.appendChild(card);
    });
}

if (openModalBtn) {
    openModalBtn.addEventListener('click',() => {
        modalOverlay.classList.remove('hidden');
        choreInput.value = '';
        choreInput.focus();
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
    });
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });
}

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const text = choreInput.value.trim();
        const tag = choreTagSelect ? choreTagSelect.value : 'Morning';
        if (text) {
            chores.push({
                id: Date.now(),
                text: text,
                tag: tag,
                completed: false
            });
            saveChoresToStorage();
            renderChores();
            modalOverlay.classList.add('hidden');
        }
    });
}

if (choreInput) {
    choreInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') saveBtn.click();
    });
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        filterButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        activeFilter = this.getAttribute('data-filter');
        renderChores();
    });
});

if (taskBoard) {
    taskBoard.addEventListener('click', (e) => {
        const item = e.target.closest('.task-item');
        if (!item) return;
        const choreId = Number(item.dataset.id);

        if (e.target.classList.contains('task-delete-btn')) {
            chores = chores.filter(c => c.id !== choreId);
            saveChoresToStorage();
            renderChores();
            return
        }

        if (e.target.classList.contains('task-check')) {
            const chore = chores.find(c => c.id === choreId);
            if (chore) {
                chore.completed = e.target.checked;
                saveChoresToStorage();
                if (activeFilter !== 'all'){
                    renderChores();
                }
            }
            return;
        }

        document.querySelectorAll('.task-item').forEach(note => {
            if (note !== item) note.classList.remove('expanded-note');
        });
        item.classList.toggle('expanded-note');
    });
}

renderChores();