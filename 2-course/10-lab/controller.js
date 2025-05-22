let allUsers = []; // збережемо всіх людей
let likedUserIds = new Set(); // збережемо id лайкнутих
let page = 1;
let isLoading = false;


function showFriendSearchApp(peopleArray) {
    hideAllContainers();
    const appContainer = createAppContainer();
    document.body.classList.add('body-block');
    document.body.classList.remove('body-flex');
    document.body.appendChild(appContainer);

    renderPageButtons(page, 5);

    allUsers = peopleArray; // Зберігаємо всіх користувачів

    renderPeopleCards(allUsers);

    loadFiltersFromURL();

    setupFilterListener();
    setupLogoutButton();
}
function hideAllContainers() {
    document.querySelectorAll('.container').forEach(el => {
        el.style.display = 'none';
    });
}
function createAppContainer() {
    const appContainer = document.createElement('div');
    appContainer.id = 'friend-app';
    appContainer.innerHTML = `
        <div class="app-container">
            <aside class="filter-sidebar">
                <h2>Фільтр</h2>
                ${createFilterFormHTML()}
                <button id="logoutBtn" type="button">Вийти</button>
            </aside>

            <main class="main-content">
                <h1>Персонажі</h1>
                <div id="personList" class="card-grid"></div>
                <div id="pageIndicator" class="page-indicator"></div>
            </main>
        </div>
    `;
    return appContainer;
}
function createFilterFormHTML() {
    return `
      <form id="filterForm">
        <label for="nameFilter">Ім’я:</label>
        <input type="text" id="nameFilter" name="name" placeholder="Введіть ім’я" />

        <label for="ageMin">Вік (min):</label>
        <input type="number" id="ageMin" name="ageMin" min="0" />

        <label for="ageMax">Вік (max):</label>
        <input type="number" id="ageMax" name="ageMax" min="0" />

        <label for="nationalityFilter">Національність:</label>
        <select id="nationalityFilter" name="nationality">
          <option value="">Всі</option>
          <option value="Українець">Українець</option>
          <option value="Німець">Німець</option>
          <option value="Британець">Британець</option>
          <option value="Американець">Американець</option>
          <option value="Італієць">Італієць</option>
          <option value="Француз">Француз</option>
          <option value="Іспанець">Іспанець</option>
          <option value="Фін">Фін</option>
          <option value="Литовець">Литовець</option>
        </select>

        <label for="alliesOnly">
          <input type="checkbox" id="alliesOnly" name="alliesOnly" />
          Показати тільки союзників (вподобаних)
        </label>

        <label for="sortSelect">Сортування:</label>
        <select id="sortSelect" name="sort">
          <option value="">-- Виберіть --</option>
          <option value="name-asc">Ім’я A-Z</option>
          <option value="name-desc">Ім’я Z-A</option>
          <option value="age-asc">Вік ↑</option>
          <option value="age-desc">Вік ↓</option>
          <option value="rank-asc">Військове звання ↑ (1 найвище)</option>
          <option value="rank-desc">Військове звання ↓</option>
          <option value="nationality-asc">Національність A-Z</option>
          <option value="nationality-desc">Національність Z-A</option>
        </select>
      </form>
    `;
}
function setupFilterListener() {
    document.getElementById("filterForm").addEventListener("input", applyFilters);
}
function setupLogoutButton() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.addEventListener('click', () => {
            // Тут логіка виходу з акаунту, очищення токена, перенаправлення і т.д.
            localStorage.removeItem("token");
            location.reload(); // або інша логіка
        });
    }
}









function renderPeopleCards(people) {
    const container = document.getElementById("personList");
    container.innerHTML = "";

    people.forEach(person => {
        const card = createCard(person);
        container.appendChild(card);
    });
}
function createCard(person) {
    const imageUrl = getPersonImageUrl(person);
    const card = document.createElement("div");
    card.className = "person-card";

    if (likedUserIds.has(person.id)) {
        card.classList.add("liked");
    }

    card.innerHTML = generatePersonCardHtml(person, imageUrl);
    card.addEventListener('click', () => toggleLike(card, person.id));

    return card;
}
function generatePersonCardHtml(person, imageUrl) {
    return `
        <img class="person-photo" src="${imageUrl}" alt="Фото ${person.firstName}">
        <div class="person-info">
            <h3>${person.firstName} ${person.lastName}</h3>
            <p>Вік: ${person.age ?? 'Н/Д'}</p>
            <p>Email: ${person.email ?? 'Немає'}</p>
            <p>Національність: ${person.nationality ?? 'Невідомо'}</p>
            <p>Звання: ${person.militaryRank ?? 'Немає'}</p>
        </div>
    `;
}
function getPersonImageUrl(person) {
    return `http://localhost:8080${person.image.url}`;
}
function toggleLike(card, userId) {
    if (likedUserIds.has(userId)) {
        likedUserIds.delete(userId);
        card.classList.remove("liked");
    } else {
        likedUserIds.add(userId);
        card.classList.add("liked");
    }

    localStorage.setItem("likedUserIds", JSON.stringify(Array.from(likedUserIds)));
}





function applyFilters(updateUrl = true) {
    const form = document.getElementById("filterForm");
    const filters = getFilterValues(form);

    if (updateUrl) {
        updateFilterUrl(filters, form);
    }

    let filteredUsers = filterUsers(allUsers, filters);
    filteredUsers = sortUsers(filteredUsers, filters.sort);

    renderPeopleCards(filteredUsers);
}
function getFilterValues(form) {
    return {
        name: form.name.value.toLowerCase(),
        ageMin: parseInt(form.ageMin.value, 10) || 0,
        ageMax: parseInt(form.ageMax.value, 10) || Infinity,
        nationality: form.nationality.value,
        showAlliesOnly: form.alliesOnly.checked,
        sort: form.sort.value
    };
}

function updateFilterUrl(filters, form) {
    const params = new URLSearchParams();

    if (filters.name) params.set("name", filters.name);
    if (form.ageMin.value) params.set("ageMin", form.ageMin.value);
    if (form.ageMax.value) params.set("ageMax", form.ageMax.value);
    if (filters.nationality) params.set("nationality", filters.nationality);
    if (filters.showAlliesOnly) params.set("alliesOnly", "1");
    if (filters.sort) params.set("sort", filters.sort);

    history.pushState(null, "", `${location.pathname}?${params.toString()}`);
}

function filterUsers(users, filters) {
    return users.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesName = fullName.includes(filters.name);
        const matchesAge = user.age >= filters.ageMin && user.age <= filters.ageMax;
        const matchesNationality = filters.nationality ? user.nationality === filters.nationality : true;
        const matchesAllies = !filters.showAlliesOnly || likedUserIds.has(user.id);

        return matchesName && matchesAge && matchesNationality && matchesAllies;
    });
}

function sortUsers(users, sortOption) {
    const compareStrings = (a, b) => a.localeCompare(b);

    switch (sortOption) {
        case 'name-asc':
            return users.sort((a, b) => compareStrings(a.firstName + a.lastName, b.firstName + b.lastName));
        case 'name-desc':
            return users.sort((a, b) => compareStrings(b.firstName + b.lastName, a.firstName + a.lastName));
        case 'age-asc':
            return users.sort((a, b) => a.age - b.age);
        case 'age-desc':
            return users.sort((a, b) => b.age - a.age);
        case 'rank-asc':
            return users.sort((a, b) => (a.militaryRank ?? "").localeCompare(b.militaryRank ?? ""));
        case 'rank-desc':
            return users.sort((a, b) => (b.militaryRank ?? "").localeCompare(a.militaryRank ?? ""));
        case 'nationality-asc':
            return users.sort((a, b) => compareStrings(a.nationality ?? "", b.nationality ?? ""));
        case 'nationality-desc':
            return users.sort((a, b) => compareStrings(b.nationality ?? "", a.nationality ?? ""));
        default:
            return users;
    }
}


function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const form = document.getElementById("filterForm");

    if (params.has("name")) form.name.value = params.get("name");
    if (params.has("ageMin")) form.ageMin.value = params.get("ageMin");
    if (params.has("ageMax")) form.ageMax.value = params.get("ageMax");
    if (params.has("nationality")) form.nationality.value = params.get("nationality");
    form.alliesOnly.checked = params.get("alliesOnly") === "1";
    if (params.has("sort")) form.sort.value = params.get("sort");

    // Викликаємо applyFilters без оновлення URL повторно
    applyFilters(false);
}



window.addEventListener("DOMContentLoaded", () => {
    loadFiltersFromURL(); // перше завантаження
    showFriendSearchApp(fetchPersons);

});
window.addEventListener("popstate", () => {
    loadFiltersFromURL(); // повторно зчитує фільтри з нового URL
});

async function fetchPersons(page) {
    const token = getAuthToken();
    const url = buildPersonsUrl(page);
    const headers = buildRequestHeaders(token);

    try {
        const response = await fetch(url, { method: "GET", headers });

        validateResponse(response);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Не вдалося отримати людей:", error);
        return [];
    }
}
function getAuthToken() {
    return localStorage.getItem("token");
}

function buildPersonsUrl(page) {
    return `http://localhost:8080/reich-media/persons/${page}`;
}

function buildRequestHeaders(token) {
    return {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
}

function validateResponse(response) {
    if (!response.ok) {
        throw new Error(`Помилка запиту: ${response.status}`);
    }
}



document.body.addEventListener('click', (event) => {
    if (event.target.id === 'logoutBtn') {
        page = 1;
        localStorage.removeItem("token");
        console.log(page);
        document.getElementById('friend-app').remove();
        document.querySelectorAll('.container').forEach(el => {
            el.style.display = 'block';
        });
        document.body.classList.remove('body-block');
        document.body.classList.add('body-flex');
    }
});



let scrollTimeout;
window.addEventListener('scroll', throttledScrollHandler);

function throttledScrollHandler() {
    if (!document.getElementById('friend-app')) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 100);
}

async function handleScroll() {
    if (isLoading || !isNearBottom()) return;

    isLoading = true;
    page++;

    try {
        const people = await fetchPersons(page);

        if (shouldStopLoading(people)) {
            window.removeEventListener('scroll', throttledScrollHandler);
        }

        if (Array.isArray(people) && people.length > 0) {
            allUsers.push(...people);
            appendPeopleCards(people);
            activatePageButton(page);
        }
    } catch (err) {
        console.error("Помилка при завантаженні сторінки:", err);
    } finally {
        isLoading = false;
    }
}

function isNearBottom() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    return scrollTop + clientHeight >= scrollHeight - 100;
}

function shouldStopLoading(people) {
    return Array.isArray(people) && people.length < 12;
}

function activatePageButton(pageNumber) {
    const button = document.querySelectorAll('.page-button')[pageNumber - 1];
    if (button) {
        button.classList.add('active');
    }
}


function appendPeopleCards(newPeople) {
    const container = document.getElementById("personList");

    newPeople.forEach(person => {
        const card = createPersonCard(person);
        container.appendChild(card);
    });

    applyFilters();
}

function createPersonCard(person) {
    const card = document.createElement("div");
    card.className = "person-card";

    if (likedUserIds.has(person.id)) {
        card.classList.add("liked");
    }

    card.innerHTML = getCardHTML(person);

    card.addEventListener('click', () => toggleLikedState(person.id, card));

    return card;
}

function getCardHTML(person) {
    const imageUrl = `http://localhost:8080${person.image.url}`;
    const {
        firstName,
        lastName,
        age,
        email,
        nationality,
        militaryRank
    } = person;

    return `
        <img class="person-photo" src="${imageUrl}" alt="Фото ${firstName}">
        <div class="person-info">
            <h3>${firstName} ${lastName}</h3>
            <p>Вік: ${age ?? 'Н/Д'}</p>
            <p>Email: ${email ?? 'Немає'}</p>
            <p>Національність: ${nationality ?? 'Невідомо'}</p>
            <p>Звання: ${militaryRank ?? 'Немає'}</p>
        </div>
    `;
}

function toggleLikedState(userId, card) {
    if (likedUserIds.has(userId)) {
        likedUserIds.delete(userId);
        card.classList.remove("liked");
    } else {
        likedUserIds.add(userId);
        card.classList.add("liked");
    }
}






function renderPageButtons(currentPage, totalPages = 5) {
    const container = document.getElementById('pageIndicator');
    clearContainer(container);

    for (let i = 1; i <= totalPages; i++) {
        const button = createPageButton(i, currentPage);
        container.appendChild(button);
    }
}

function clearContainer(container) {
    container.innerHTML = '';
}

function createPageButton(pageNumber, currentPage) {
    const button = document.createElement('button');
    button.textContent = pageNumber;
    button.classList.add('page-button');
    if (pageNumber === currentPage) {
        button.classList.add('active');
    }

    button.addEventListener('click', () => onPageButtonClick(pageNumber, button));
    return button;
}

async function onPageButtonClick(pageNumber, button) {
    if (isLoading || page === pageNumber) return;

    isLoading = true;
    page = pageNumber;

    try {
        const people = await fetchPersons(page);
        if (Array.isArray(people) && people.length > 0) {
            updatePersonList(people);
            scrollToTop();
            updateActiveButton(button);
            window.addEventListener('scroll', throttledScrollHandler);
        }
    } catch (err) {
        console.error("Помилка при завантаженні сторінки:", err);
    } finally {
        isLoading = false;
        renderPageButtons(page, totalPages);
    }
}

function updatePersonList(people) {
    const personList = document.getElementById("personList");
    personList.innerHTML = "";
    allUsers = [...people];
    appendPeopleCards(people);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const app = document.getElementById('friend-app');
    if (app) app.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveButton(activeButton) {
    document.querySelectorAll('.page-button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}
