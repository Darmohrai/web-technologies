const roundLinks = document.querySelector(".rounds");
const roundContent = document.querySelector(".result-window-main");
const roundsNav = document.querySelector(".rounds");
const resultWindow =  document.querySelector(".result-window");
const footerTitle = document.querySelector(".result-window-footer-title");

roundLinks.addEventListener("click", changeViewHandler);

function changeViewHandler(event) {
    const newActiveLink = event.target.closest(".round-link");
    if (!newActiveLink) return;

    const currentActiveLink = document.querySelector(".round-link.active");
    if (currentActiveLink) {
        currentActiveLink.classList.remove("active");
    }

    newActiveLink.classList.add("active");
    changeRoundView(newActiveLink.id);
}

function changeRoundView(round) {
    const usersRound = matchHistory[round];
    roundContent.innerHTML = '';
    for (const log of usersRound) {
        const isWonClass = log.isWon ? "won" : "lost";
        const isWonText = log.isWon ? "Won" : "Lost";

        const item = `
        <div class="player-stat">
            <div class="player-stat-header">
                <h3 class="player-name">${log.username}</h3>
                <h3 class="game-result-title ${isWonClass}">${isWonText}</h3>
            </div>
            <div class="player-stat-main">
                <ul class="player-game-results-list">
                    <li class="player-game-results-item">
                        <span class="item-title">Attempts: </span>
                        <span class="item-content">${log.attempts}</span>
                    </li>
                    <li class="player-game-results-item">
                        <span class="item-title">Points earned: </span>
                        <span class="item-content">${log.points}</span>
                    </li>
                    <li class="player-game-results-item">
                        <span class="item-title">Time spent: </span>
                        <span class="item-content">${log.timeSpent} sec</span>
                    </li>
                </ul>
            </div>
        </div>`;
        roundContent.innerHTML += item;
    }
}

function renderRoundsNav() {
    roundsNav.innerHTML = '';
    for (const key in matchHistory) {
        const roundNumber = key.replace(/\D/g, '');
        const round = `
        <li class="round">
            <a class="round-link" id="${key}">Round ${roundNumber}</a>
        </li>`;
        roundsNav.innerHTML += round;
    }

    const firstLink = document.querySelector(".round-link");
    if (firstLink) {
        firstLink.classList.add("active");
        changeRoundView(firstLink.id);
    }
}

function showEndGamePage(){
    gameContainer.style.display = "none";
    resultWindow.style.display = "block";
    renderRoundsNav();
    changeRoundView("round1");

    if (game.twoPlayersMode) {
        const winner = getUserWithMostWins();
        footerTitle.innerHTML = `Congratulations ${winner ? winner : "Player"}`;
    } else {
        const firstRound = matchHistory["round1"];
        const player = firstRound && firstRound[0] ? firstRound[0].username : "Player";
        footerTitle.innerHTML = `Congratulations ${player}`;
    }
}

function getUserWithMostWins() {
    const winCounts = {};

    for (const round in matchHistory) {
        for (const log of matchHistory[round]) {
            if (log.isWon) {
                winCounts[log.username] = (winCounts[log.username] || 0) + 1;
            }
        }
    }

    let maxWins = 0;
    let topUser = null;

    for (const user in winCounts) {
        if (winCounts[user] > maxWins) {
            maxWins = winCounts[user];
            topUser = user;
        }
    }

    return topUser;
}

