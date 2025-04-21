let draggedTask = null;
let placeholder = null;

window.addEventListener('load', () => {
    loadTasks();
    initDragAndDrop();
});

document.getElementById('add-task-btn').addEventListener('click', () => {
    addNewTask();
});

function addNewTask() {
    const titleInput = document.getElementById('new-task-title');
    const descInput = document.getElementById('new-task-desc');
    const title = titleInput.value.trim();
    const description = descInput.value.trim();

    if (title !== '') {
        const task = createTaskElement(title, description);
        document.getElementById('todo').appendChild(task);
        saveTasks();
        clearTaskInputs(titleInput, descInput);
    }
}

function createTaskElement(title, description) {
    const task = document.createElement('div');
    task.className = 'task';
    task.setAttribute('draggable', 'true');

    const titleEl = createTaskTitle(title);
    const descEl = createTaskDescription(description);

    task.appendChild(titleEl);
    task.appendChild(descEl);

    addDragEvents(task);

    return task;
}

function createTaskTitle(title) {
    const titleEl = document.createElement('div');
    titleEl.className = 'title';
    titleEl.textContent = title;
    return titleEl;
}

function createTaskDescription(description) {
    const descEl = document.createElement('div');
    descEl.className = 'description';
    descEl.textContent = description;
    return descEl;
}

function addDragEvents(task) {
    task.addEventListener('dragstart', () => {
        draggedTask = task;
        placeholder = document.createElement('div');
        placeholder.className = 'placeholder';
        setTimeout(() => task.style.display = 'none', 0);
    });

    task.addEventListener('dragend', () => {
        setTimeout(() => {
            task.style.display = 'block';
            draggedTask = null;
            if (placeholder && placeholder.parentNode) {
                placeholder.parentNode.removeChild(placeholder);
            }
        }, 0);
    });
}

function clearTaskInputs(titleInput, descInput) {
    titleInput.value = '';
    descInput.value = '';
}

function initDragAndDrop() {
    const columns = document.querySelectorAll('.column');
    columns.forEach(column => {
        setupColumnDragEvents(column);
    });
}

function setupColumnDragEvents(column) {
    column.addEventListener('dragover', e => handleDragOver(e, column));
    column.addEventListener('dragleave', () => handleDragLeave(column));
    column.addEventListener('drop', () => handleDrop(column));
}

function handleDragOver(e, column) {
    e.preventDefault();

    const afterElement = getDragAfterElement(column, e.clientY);
    if (afterElement == null) {
        column.appendChild(placeholder);
    } else {
        column.insertBefore(placeholder, afterElement);
    }
}

function handleDragLeave(column) {
    if (placeholder && placeholder.parentNode === column) {
        column.removeChild(placeholder);
    }
}

function handleDrop(column) {
    if (placeholder && draggedTask) {
        placeholder.replaceWith(draggedTask);
        saveTasks();
    }
}

function getDragAfterElement(container, y) {
    const elements = [...container.querySelectorAll('.task:not(.placeholder):not([style*="display: none"])')];

    return elements.reduce((closest, el) => {
        const box = el.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset, element: el };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveTasks() {
    const columns = ['todo', 'in-progress', 'done'];
    const data = {};

    columns.forEach(id => {
        const column = document.getElementById(id);
        const tasks = Array.from(column.querySelectorAll('.task')).map(task => ({
            title: task.querySelector('.title').textContent,
            description: task.querySelector('.description').textContent
        }));
        data[id] = tasks;
    });

    localStorage.setItem('kanbanTasks', JSON.stringify(data));
}

function loadTasks() {
    const saved = JSON.parse(localStorage.getItem('kanbanTasks'));
    if (!saved) return;

    Object.keys(saved).forEach(id => {
        const column = document.getElementById(id);
        saved[id].forEach(({ title, description }) => {
            const task = createTaskElement(title, description);
            column.appendChild(task);
        });
    });
}
