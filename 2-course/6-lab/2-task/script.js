document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('todo-form');
    const taskInput = document.getElementById('new-task');
    const taskList = document.getElementById('task-list');
    const sortSelect = document.getElementById('sort-options');

    let tasks = (JSON.parse(localStorage.getItem('tasks')) || []).map(t => ({
        ...t,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
    }));

    function createTask(text) {
        return ({
            id: Date.now(),
            text,
            status: 'Не почато',
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const sortedTasks = [...tasks].sort(getSortFunction(sortSelect.value));
        sortedTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
            setTimeout(() => taskElement.classList.add('task-enter-active'), 0);
        });
    }

    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed task-enter' : 'task-enter';

        const textElement = createTextElement(task);
        const actionsElement = createActionsElement(task);

        li.appendChild(textElement);
        li.appendChild(actionsElement);

        return li;
    }

    function createTextElement(task) {
        const span = document.createElement('span');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = task.text;
        input.readOnly = true;
        span.appendChild(input);
        return span;
    }

    function createActionsElement(task) {
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
        button.onclick = () => editTask(task.id);
        return button;
    }

    function createDeleteButton(task) {
        const button = document.createElement('button');
        button.textContent = 'Видалити';
        button.onclick = (e) => {
            e.stopPropagation();
            deleteTask(task.id);
        };
        return button;
    }

    function createStatusDropdown(task) {
        const select = document.createElement('select');
        select.className = 'task-status';

        ['Не почато', 'В процесі', 'Завершено'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (task.status === status) option.selected = true;
            select.appendChild(option);
        });

        select.addEventListener('change', () =>
            updateStatus(task.id, select.value)
        );

        return select;
    }


    function addTask(text) {
        tasks.push(createTask(text));
        saveTasks();
        renderTasks();
    }

    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }

    function editTask(id) {
        const task = tasks.find(t => t.id === id);
        const newText = prompt('Редагувати завдання', task.text);
        if (newText?.trim()) {
            updateTask(id, newText.trim());
        }
    }

    function updateTask(id, newText) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.text = newText;
            task.updatedAt = new Date();
            saveTasks();
            renderTasks();
        }
    }

    function updateStatus(id, newStatus) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.status = newStatus;
            task.completed = newStatus === 'Завершено';
            task.updatedAt = new Date();
            saveTasks();
            renderTasks();
        }
    }

    function getSortFunction(criteria) {
        switch (criteria) {
            case 'status':
                return (a, b) => {
                    const order = {'Не почато': 0, 'В процесі': 1, 'Завершено': 2};
                    return order[a.status] - order[b.status];
                };
            case 'updated':
                return (a, b) => b.updatedAt - a.updatedAt;
             case 'created':
                return (a, b) => b.createdAt - a.createdAt;
        }
    }

    function handleFormSubmit(event) {
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