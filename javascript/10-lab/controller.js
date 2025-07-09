let allUsers = [];
let likedUserIds = new Set();
let page = null;
let isLoading = false;


async function showFriendSearchApp(peopleArray) {
    hideAllContainers();
    const appContainer = createAppContainer();
    document.body.classList.add('body-block');
    document.body.classList.remove('body-flex');
    document.body.appendChild(appContainer);

    renderPageButtons(page, 3);

    allUsers = peopleArray;

    await setupFilterListener();
    setupLogoutButton();


    const personList = document.getElementById("personList");
    personList.style.display = 'none';

    await renderPeopleCards(allUsers);

    await loadFiltersFromURL();
    updateFilterUrl();

    personList.style.removeProperty('display');

    window.addEventListener('scroll', throttledScrollHandler);
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

async function setupFilterListener() {
    document.getElementById("filterForm").addEventListener("input", await applyFilters);
}

function setupLogoutButton() {
    const btn = document.getElementById("logoutBtn");
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.removeItem("token");
            localStorage.removeItem("likedUserIds");
        });
        window.removeEventListener('scroll', throttledScrollHandler);
    }
}


async function renderPeopleCards(people) {
    const container = document.getElementById("personList");
    container.innerHTML = "";

    for (const person of people) {
        const cardElement = await createCard(person);
        if (cardElement) {
            container.appendChild(cardElement);
        }
    }
}

async function renderNewPeopleCards(people) {
    const container = document.getElementById("personList");

    for (const person of people) {
        const cardElement = await createCard(person);
        if (cardElement) {
            container.appendChild(cardElement);
        }
    }
}

async function createCard(person) {
    const imageUrl = getPersonImageUrl(person);
    const card = document.createElement("div");
    card.className = "person-card";

    if (likedUserIds.has(person.id)) {
        card.classList.add("liked");
    }

    try {
        const html = await generatePersonCardHtml(person, imageUrl);

        if (!html) {
            showErrorMessage(`⚠️ Не вдалося створити картку для ${person.firstName} ${person.lastName}`);
            return null;
        }

        card.innerHTML = html;
        card.addEventListener('click', () => toggleLike(card, person.id));
        return card;
    } catch (error) {
        showErrorMessage(`❌ Помилка при створенні картки: ${error.message}`);
        return null;
    }
}


function generatePersonCardHtml(person, imageUrl) {
    const token = getAuthToken();

    const header = {
        "Authorization": `Bearer ${token}`
    };

    return fetch(imageUrl, {method: "GET", headers: header})
        .then(r => r.blob())
        .then(blob => {
            const imageObjectUrl = URL.createObjectURL(blob);
            return `
                <img class="person-photo" src="${imageObjectUrl}" alt="Фото ${person.firstName}">
                <div class="person-info">
                    <h3>${person.firstName} ${person.lastName}</h3>
                    <p>Вік: ${person.age ?? 'Н/Д'}</p>
                    <p>Email: ${person.email ?? 'Немає'}</p>
                    <p>Національність: ${person.nationality ?? 'Невідомо'}</p>
                    <p>Звання: ${person.militaryRank ?? 'Немає'}</p>
                </div>
            `;
        });
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


async function applyFilters(updateUrl = true) {
    const form = document.getElementById("filterForm");
    const filters = getFilterValues(form);

    if (updateUrl) {
        updateFilterUrl();
    }

    let filteredUsers = filterUsers(allUsers, filters);
    filteredUsers = sortUsers(filteredUsers, filters.sort);

    await renderPeopleCards(filteredUsers);
}

async function applyFiltersForNewPeople(updateUrl = true, newPeople) {
    const form = document.getElementById("filterForm");
    const filters = getFilterValues(form);

    if (updateUrl) {
        updateFilterUrl();
    }

    let filteredUsers = filterUsers(newPeople, filters);
    filteredUsers = sortUsers(filteredUsers, filters.sort);

    await renderNewPeopleCards(filteredUsers);
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

function updateFilterUrl() {
    const params = new URLSearchParams();
    const form = document.getElementById("filterForm");
    const filters = getFilterValues(form);

    if (filters?.name) params.set("name", filters.name);
    if (form?.ageMin.value) params.set("ageMin", form.ageMin.value);
    if (form?.ageMax.value) params.set("ageMax", form.ageMax.value);
    if (filters?.nationality) params.set("nationality", filters.nationality);
    if (filters?.showAlliesOnly) params.set("alliesOnly", "1");
    if (filters?.sort) params.set("sort", filters.sort);

    let pages = new Set();

    const pageButton = document.querySelectorAll('.page-button');
    pageButton.forEach(button => {
        if (button.classList.contains('active')) {
            pages.add(button.textContent);
        }
    })

    params.set("pages", Array.from(pages).join(','));

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
            return users.sort((a, b) => a.militaryRank - b.militaryRank);
        case 'rank-desc':
            return users.sort((a, b) => b.militaryRank - a.militaryRank);
        case 'nationality-asc':
            return users.sort((a, b) => compareStrings(a.nationality ?? "", b.nationality ?? ""));
        case 'nationality-desc':
            return users.sort((a, b) => compareStrings(b.nationality ?? "", a.nationality ?? ""));
        default:
            return users;
    }
}


async function loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const form = document.getElementById("filterForm");

    if (params.has("name")) form.name.value = params.get("name");
    if (params.has("ageMin")) form.ageMin.value = params.get("ageMin");
    if (params.has("ageMax")) form.ageMax.value = params.get("ageMax");
    if (params.has("nationality")) form.nationality.value = params.get("nationality");
    form.alliesOnly.checked = params.get("alliesOnly") === "1";
    if (params.has("sort")) form.sort.value = params.get("sort");

    // Викликаємо applyFilters без оновлення URL повторно
    await applyFilters(false);
}

function loadPagesFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const pagesParam = params.get("pages"); // дасть "1,2"

    return pagesParam
        ? new Set(pagesParam.split(',').map(p => p.trim()).filter(p => p !== ''))
        : new Set();
}


window.addEventListener("DOMContentLoaded", async () => {

    await loadFiltersFromURL(); // перше завантаження
    await showFriendSearchApp(fetchPersons);

});
window.addEventListener("popstate", async () => {
    await loadFiltersFromURL(); // повторно зчитує фільтри з нового URL
});

async function fetchPersons(page) {
    const token = getAuthToken();
    const url = buildPersonsUrl(page);
    const headers = buildRequestHeaders(token);

    try {
        const response = await fetch(url, {method: "GET", headers});

        validateResponse(response);

        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        if (error?.status === 404 || error?.message?.includes?.('404')) {
            showErrorMessage("Сторінку не знайдено (404) – помилка запиту.");
        } else {
            showErrorMessage("Не вдалося отримати людей – " + error.message || error);
        }
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
        document.getElementById('friend-app').remove();
        document.querySelectorAll('.container').forEach(el => {
            el.style.display = 'block';
        });
        document.body.classList.remove('body-block');
        document.body.classList.add('body-flex');

    }
});


let scrollTimeout;

// window.addEventListener('scroll', throttledScrollHandler);

function throttledScrollHandler() {
    if (!document.getElementById('friend-app')) return;

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 100);
    updateFilterUrl();

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

            //scrollToTopLittle();
            await appendPeopleCards(people);
            activatePageButton(page);
        }
    } catch (err) {
        showErrorMessage("Помилка при завантаженні сторінки:", err)
    } finally {
        isLoading = false;
    }

}

function isNearBottom() {
    const {scrollTop, scrollHeight, clientHeight} = document.documentElement;
    return scrollTop + clientHeight >= scrollHeight - 20;
}

function shouldStopLoading(people) {
    return Array.isArray(people) && people.length < 12;
}

function activatePageButton(pageNumber) {
    const button = document.querySelectorAll('.page-button')[pageNumber - 1];
    if (button) {
        button.classList.add('active');
    }
    updateFilterUrl();
}


async function appendPeopleCards(newPeople) {
    const container = document.getElementById("personList");

    const cards = await Promise.all(
        newPeople.map(person => createPersonCard(person))
    );

    //cards.forEach(card => container.appendChild(card));

    await applyFiltersForNewPeople(true, Array.from(newPeople));
}

async function createPersonCard(person) {
    const card = document.createElement("div");
    card.className = "person-card";

    if (likedUserIds.has(person.id)) {
        card.classList.add("liked");
    }

    card.innerHTML = await getCardHTML(person);

    card.addEventListener('click', () => toggleLikedState(person.id, card));

    return card;
}

async function getCardHTML(person) {
    const imageUrl = `http://localhost:8080${person.image.url}`;
    const {
        firstName,
        lastName,
        age,
        email,
        nationality,
        militaryRank
    } = person;

    try {
        const token = getAuthToken();

        const header = {
            "Authorization": `Bearer ${token}`
        }
        const response = await fetch(imageUrl, {method: "GET", headers: header});

        return `
        <img class="person-photo" src="${response}" alt="Фото ${firstName}">
        <div class="person-info">
            <h3>${firstName} ${lastName}</h3>
            <p>Вік: ${age ?? 'Н/Д'}</p>
            <p>Email: ${email ?? 'Немає'}</p>
            <p>Національність: ${nationality ?? 0}</p>
            <p>Звання: ${militaryRank ?? 0}</p>
        </div>
    `;
    } catch (error) {
        console.error(error);
        showErrorMessage(error.message);
    }
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


let firstLoad = true

function renderPageButtons(currentPage, totalPages = 3) {
    const container = document.getElementById('pageIndicator');
    clearContainer(container);
    let activePages = new Set();
    if (firstLoad) {
        activePages = loadPagesFromUrl();
    }

    for (let i = 1; i <= totalPages; i++) {
        const button = createPageButton(i, currentPage);
        if (firstLoad) {
            if (activePages.has(i.toString())) {
                button.classList.add('active');
                page = i;
            }
        }
        container.appendChild(button);
    }
    firstLoad = false;
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
            const personList = document.getElementById("personList");
            personList.style.display = "none"

            updateActiveButton(button);
            updateFilterUrl();
            await updatePersonList(people);

            personList.style.removeProperty("display");

            scrollToTop();
            window.addEventListener('scroll', throttledScrollHandler);
        }
    } catch (err) {
        console.error("Помилка при завантаженні сторінки:", err);
    } finally {
        isLoading = false;
        renderPageButtons(page, 3);
    }
}

async function updatePersonList(people) {
    const personList = document.getElementById("personList");
    personList.innerHTML = "";
    allUsers = [...people];
    await appendPeopleCards(people);
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
    const app = document.getElementById('friend-app');
    if (app) app.scrollTo({top: 0, behavior: 'smooth'});
}

function updateActiveButton(activeButton) {
    document.querySelectorAll('.page-button').forEach(btn => {
        btn.classList.remove('active');
    });
    activeButton.classList.add('active');
}


function showResponseErrors(errors) {
    if (!Array.isArray(errors)) {
        showErrorMessage("❌ Невірний формат помилок. Спробуйте пізніше.");
        return;
    }

    errors.forEach((error, index) => {
        const {
            code = "UNKNOWN_CODE",
            message = "Сталася помилка без опису.",
            field,
            timestamp,
            status
        } = error;

        let fullMessage = `🚨 Помилка #${index + 1}:\n`;
        fullMessage += `📄 ${message}\n`;

        if (field) fullMessage += `🔧 Поле: ${field}\n`;
        if (code) fullMessage += `🆔 Код: ${code}\n`;
        if (status !== undefined) fullMessage += `📶 Статус: ${status}\n`;
        if (timestamp) fullMessage += `⏰ Час: ${timestamp}`;

        showErrorMessage(fullMessage.trim());
    });
}
