const users = [];

let timerInterval;

function switchUser(){
    const turnHolder = document.querySelector(".game-header-turn");

    if (!game.twoPlayersMode) {
        turnHolder.innerHTML = "Your Move!";
        return;
    }

    if (game.currentActiveUser === 0) {
        game.currentActiveUser = 1;
    }
    else {
        game.currentActiveUser = 0;
    }
    turnHolder.innerHTML = `${users[game.currentActiveUser].username} turn`;
    clearInterval(timerInterval);
    continueUserTimer(users[game.currentActiveUser]);
}

function continueUserTimer(user){
    console.log(user);
    const timerElement = user.aside.querySelector(".timer");

    timerInterval = setInterval(() => {
        if (user.timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.textContent = "Time's up!";
            expiredTimeHandler();
        } else {
            timerElement.textContent = `${user.timeLeft} sec`;
            user.timeLeft--;
        }
    }, 1000);

}

function addUser(username, time) {
    const id = users.length + 1;
    const user = {
        id: id,
        username: username,
        timeLeft: time,
        points: 0,
        attempts: 0,
        aside: document.getElementById(`user-aside-${id}`)
    };
    users.push(user);
}

function displayUsers() {
    for (const user of users) {
        user.aside.innerHTML = `
            <h3 class="user-aside-title">${user.username}</h3>
            <p class="user-aside-item"><strong>Timer:</strong> <span class="timer">${user.timeLeft} sec</span></p>
            <p class="user-aside-item"><strong>Points:</strong> <span class="points">${user.points}</span></p>`;

        user.timerElement = user.aside.querySelector(".timer");
    }
}

function addPoints(){
    users[game.currentActiveUser].points++;
    showPoints();
}

function addAttempts(){
    users[game.currentActiveUser].attempts++;
}

function showPoints(){
    const pointsHolder = users[game.currentActiveUser].aside.querySelector(".points");
    pointsHolder.innerHTML = users[game.currentActiveUser].points;
}

function resetUsers(){
    for (let user of users) {
        user.timeLeft = game.difficulty;
        user.attempts = 0;
        user.points = 0;
    }
}

function clearUserAsides(){
    const asides = document.querySelectorAll(".user-aside");
    for (const aside of asides){
        aside.innerHTML = "";
    }
}