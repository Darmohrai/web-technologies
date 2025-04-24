const startGameBtn = document.getElementById("startGameBtn");
const resetBtn = document.getElementById("resetGameBtn");
const restartBtn = document.getElementById("restartBtn");
const game = {
    roundQuantity:1,
    currentRound:1,
    twoPlayersMode:false,
    cardsQuantity:6,
    difficulty:180,
    users:users,
    currentActiveUser:0
}
const menuBtn = document.querySelector(".main-link");

const matchHistory = {};
startGameBtn.addEventListener("click",setUpGameSettingsAndStartHandler);
resetBtn.addEventListener("click",resetSettingsHandler);
restartBtn.addEventListener("click",restartGameHandler);
menuBtn.addEventListener("click",menuRedirectionHandler);

function setUpGameSettingsAndStartHandler(){
    const difficulty = document.getElementById("difficulty");
    const cardsQuantity = document.getElementById("cardQuantity");
    const playerMode = document.getElementById("playerMode");
    if (Number(playerMode.value) > 1){
        setUpDoublePlayerMode(Number(difficulty.value));
        game.roundQuantity = Number(document.getElementById("roundQuantity").value);
    }else{
        setUpSinglePlayerMode(Number(difficulty.value));
    }
    game.cardsQuantity = Number(cardsQuantity.value);
    game.difficulty = Number(difficulty.value);

    startGame();
}

function setUpDoublePlayerMode(time){
    const username2 = document.getElementById("player2Name").value;
    setUpSinglePlayerMode(time)
    game.twoPlayersMode = true;
    addUser(username2,time);
}

function setUpSinglePlayerMode(time){
    const username1 = document.getElementById("player1Name").value;
    addUser(username1,time);
}

function startGame(){
    renderGame();
    continueUserTimer(game.users[game.currentActiveUser]);
}

function expiredTimeHandler(){
    if (!game.twoPlayersMode){
        endGameHandler();
    }
    else if (users[0].timeLeft === 0 &&  users[1].timeLeft === 0){
        endGameHandler();
    }else{
        switchUser();
    }
}

function endGameHandler(){
    if (!game.twoPlayersMode){
        logSingleUserActions();
        showEndGamePage();
    }
    else{
       logUsersActions();
       if (game.currentRound < game.roundQuantity){
           nextRound();
       }else{
           showEndGamePage();
           clearUserAsides();
       }
    }
}

function logSingleUserActions(){
    const roundKey = "round" + game.currentRound;
    matchHistory[roundKey] = [
        {
            username: game.users[0].username,
            isWon: game.users[0].points === (game.cardsQuantity),
            attempts: game.users[0].attempts,
            points: game.users[0].points,
            timeSpent: game.difficulty - game.users[0].timeLeft
        },
    ];
}

function logUsersActions(){
    const roundKey = "round" + game.currentRound;
    matchHistory[roundKey] = [
        {
            username: game.users[0].username,
            isWon: game.users[0].points > game.users[1].points,
            attempts: game.users[0].attempts,
            points: game.users[0].points,
            timeSpent: game.difficulty - game.users[0].timeLeft
        },
        {
            username: game.users[1].username,
            isWon: game.users[1].points > game.users[0].points,
            attempts: game.users[1].attempts,
            points: game.users[1].points,
            timeSpent: game.difficulty - game.users[1].timeLeft
        }
    ];
}

function nextRound(){
    game.currentRound++;
    restartGame();
}

function restartGame(){
    resetUsers();
    startGame();
}

function resetSettingsHandler(){
    document.getElementById("difficulty").selectedIndex = 0;
    document.getElementById("cardQuantity").selectedIndex = 0;
    document.getElementById("playerMode").selectedIndex = 0;
    showUsernameInputs();
}

function restartGameHandler(){
    resultWindow.style.display = "none";
    restartGame();
}

function resetGameSettings(){
    game.roundQuantity = 1;
    game.currentRound = 1;
    game.twoPlayersMode = false;
    game.cardsQuantity = 6;
    game.difficulty = 180;
    game.currentActiveUser = 0;
    users.length = 0;
}

function menuRedirectionHandler(){
    resetGameSettings();
    resultWindow.style.display = "none";
    introContainer.style.display = "flex";
}

function checkGameStatus() {
    const cards = Array.from(cardsContainer.children);
    return cards
        .map(card => card.querySelector(".card-inner"))
        .every(inner => inner.classList.contains("flipped"));
}