const gameContainer = document.querySelector(".game-container");
const cardsContainer = document.querySelector(".cards");
const introContainer = document.querySelector(".intro");
const playerInputsDiv = document.getElementById("playerInputs");
const playerModeSelect = document.getElementById("playerMode");

let currentCard = null;
const markUp = {
    8: {
        rows:4,
        cols:4
    },
    10:{
        rows:4,
        cols:5
    },
    12:{
        rows:4,
        cols:6
    },
    15:{
        rows:5,
        cols:6
    }
};

cardsContainer.addEventListener("mousedown", (event) => {
    let innerCard = event.target.closest(".card-inner");
    if (innerCard!==null) {
        clickCardHandler(innerCard);
        setTimeout(() => {
            if (checkGameStatus()){
                endGameHandler();
                clearInterval(timerInterval);
            }
        },1000)
    }
})

playerModeSelect.addEventListener("change", showUsernameInputs);

function compareCards(currentCard, prevCard){
    const currentImg = currentCard.querySelector(".card-img");
    const targetImg = prevCard.querySelector(".card-img");
    return currentImg.src === targetImg.src;
}

function clickCardHandler(target) {
    if (target.classList.contains("flipped")) {
        return;
    }

    rotateCard(target);

    if (currentCard !== null) {
        const previousCard = currentCard;
        setTimeout(function () {
            if (!compareCards(target,previousCard)) {
                rotateCardsBack(target, previousCard);
                switchUser();
            }else{
                addPoints();
            }
            addAttempts();
        }, 400);
        currentCard = null;

    } else {
        currentCard = target;
    }
}

function rotateCardsBack(target, previousCard) {
    target.classList.remove("flipped");
    previousCard.classList.remove("flipped");
    previousCard.closest(".card-inner").style.transform = "rotateY(0deg)";
    target.closest(".card-inner").style.transform = "rotateY(0deg)";
}

function rotateCard(card){
    card.classList.add("flipped");
    card.style.transform = "rotateY(180deg)";
}

function Shuffle(o) {
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function generateCards(cardsQuantity){
    let fruits = [];
    for (let i = 0; i < cardsQuantity; i++) {
        const fruit = {
            img: `fruits/fruit_${i}.png`,
            alt: `fruit_${i}`
        };
        fruits.push(fruit, {...fruit});
    }
    return Shuffle(fruits);
}

function displayCards(fruits){
    cardsContainer.innerHTML = "";
    for (let fruit of fruits){
        const card = `<div class="card">
                <div class="card-inner">
                    <div class="card-back">
                        <img src=${fruit.img} alt=${fruit.alt} class="card-img"/>
                    </div>
                    <div class="card-front">
                        <img src="fruits/back.png" alt="back" class="default-card-img"/>
                    </div>
                </div>
            </div>`;
        cardsContainer.innerHTML += card;
    }
}

function createMatrix(cardsQuantity){
    let markUpParams = markUp[cardsQuantity];
    cardsContainer.style.gridTemplateColumns = `repeat(${markUpParams.cols},100px)`;
    cardsContainer.style.gridTemplateRows = `repeat(${markUpParams.rows},120px)`;
}

function renderGame(){
    introContainer.style.display = "none";
    gameContainer.style.display = "block";
    createMatrix(game.cardsQuantity);
    let fruits = generateCards(game.cardsQuantity);
    displayCards(fruits);
    displayUsers();
}

function showUsernameInputs(){
    const mode = Number(playerModeSelect.value);
    playerInputsDiv.innerHTML = '';
    showFirstUsernameInput();

    if (mode === 2) {
        showSecondUsernameInput();
    }
}

function showSecondUsernameInput(){
    const input2 = document.createElement("input");
    input2.type = "text";
    input2.placeholder = "Player 2 Name";
    input2.id = "player2Name";
    input2.classList.add("intro-input");
    playerInputsDiv.appendChild(input2);

    const roundQuantity = `
            <label for="roundQuantity">Number of Rounds:</label>
            <select id="roundQuantity" class="intro-select">
                <option value="1" selected>1</option>
                <option value="3" >3</option>
                <option value="5">5</option>
            </select>`;

    playerInputsDiv.innerHTML += roundQuantity;
}

function showFirstUsernameInput(){
    const input1 = document.createElement("input");
    input1.type = "text";
    input1.placeholder = "Player 1 Name";
    input1.id = "player1Name";
    input1.classList.add("intro-input");
    playerInputsDiv.appendChild(input1);
}
