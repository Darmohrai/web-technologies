document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('todo-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const sortSelect = document.getElementById('sort-options');

    const loadTasks = () => JSON.parse(localStorage.getItem('tasks')) || [];
    const saveTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

    const createTask = (text) => ({
        id: Date.now(),
        text,
        status: 'Не почато',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    function addTask (text) {
        const tasks = loadTasks();
        const newTask = createTask(text);
        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();
    }

    function deleteTask (id) {
        const tasks = loadTasks().filter(task => task.id !== id);
        saveTasks(tasks);
        renderTasks();
    }

    function editTask (id, newText) {
        const tasks = loadTasks().map(task => {
            if (task.id === id) {
                return {...task, text: newText, updatedAt: new Date()};
            }
            return task;
        });
        saveTasks(tasks);
        renderTasks();
    }

    function updateStatus (id, newStatus) {
        const tasks = loadTasks().map(task => {
            if (task.id === id) {
                return {...task, status: newStatus, completed: newStatus === 'Завершено', updatedAt: new Date()};
            }
            return task;
        });
        saveTasks(tasks);
        renderTasks();
    }

    function getSortFunction (criteria) {
        switch (criteria) {
            case 'status':
                return (a, b) => {
                    const order = {'Не почато': 0, 'В процесі': 1, 'Завершено': 2};
                    return order[a.status] - order[b.status];
                };
            case 'updated':
                return (a, b) => {
                    const dateA = new Date(a.updatedAt);
                    const dateB = new Date(b.updatedAt);
                    return dateB - dateA;
                };
            case 'created':
                return (a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return dateB - dateA;
                };
            default:
                return () => 0;
        }
    }

    function toggleCompletion (id) {
        const tasks = loadTasks().map(task => {
            if (task.id === id) {
                return {
                    ...task,
                    completed: !task.completed,
                    status: task.completed ? 'Не почато' : 'Завершено',
                    updatedAt: new Date()
                };
            }
            return task;
        });
        saveTasks(tasks);
        renderTasks();
    }

    function renderTasks () {
        taskList.innerHTML = '';
        const tasks = loadTasks().sort(getSortFunction(sortSelect.value));
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
            setTimeout(() => taskElement.classList.add('task-enter-active'), 0);
        });
    }

    function createTaskElement (task) {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed task-enter' : 'task-enter';
        li.addEventListener('click', (event) => handleTaskClick(event, task));

        const textElement = createTextElement(task);
        const actionsElement = createActionsElement(task);

        li.appendChild(textElement);
        li.appendChild(actionsElement);

        return li;
    }

    function createTextElement (task) {
        const span = document.createElement('span');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.readOnly = true;
        input.addEventListener('dblclick', () => enableEditMode(input, task));
        input.addEventListener('blur', () => disableEditMode(input, task));

        span.appendChild(input);
        return span;
    }

    function enableEditMode(input) {
        input.readOnly = false;
        input.focus();
        input.selectionStart = input.selectionEnd = input.value.length;
    }


    function disableEditMode(input, task) {
        input.readOnly = true;
        if (input.value.trim() !== task.text) {
            editTask(task.id, input.value.trim());
        }
    }


    function createActionsElement (task) {
        const actions = document.createElement('div');
        actions.className = 'actions';

        const editBtn = createEditButton(task);
        const deleteBtn = createDeleteButton(task);
        const statusDropdown = createStatusDropdown(task);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        actions.appendChild(statusDropdown);

        return actions;
    }

    function createEditButton(task) {
        const button = document.createElement('button');
        button.textContent = 'Редагувати';
        button.onclick = (e) => {
            e.stopPropagation();
            const li = e.target.closest('li');
            const input = li.querySelector('input[type="text"]');
            enableEditMode(input, task);
        };
        return button;
    }


    function createDeleteButton (task) {
        const button = document.createElement('button');
        button.textContent = 'Видалити';
        button.onclick = (e) => {
            e.stopPropagation();
            const li = e.target.closest('li');
            li.classList.add('task-leave');
            setTimeout(() => {
                deleteTask(task.id);
            }, 300);
        };
        return button;
    }

    function createStatusDropdown (task) {
        const select = document.createElement('select');
        select.className = 'task-status';
        ['Не почато', 'В процесі', 'Завершено'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (task.status === status) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener('change', (e) => {
            e.stopPropagation();
            updateStatus(task.id, select.value);
        });

        return select;
    }

    function handleTaskClick (event, task) {
        if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT' && event.target.tagName !== 'SELECT') {
            toggleCompletion(task.id);
        }
    }

    function handleFormSubmit (event) {
        event.preventDefault();
        const value = taskInput.value.trim();
        if (value) {
            addTask(value);
            taskInput.value = '';
        }
    }

    function handleSortChange() {
        renderTasks();
    }

    form.addEventListener('submit', handleFormSubmit);
    sortSelect.addEventListener('change', handleSortChange);

    renderTasks();
});