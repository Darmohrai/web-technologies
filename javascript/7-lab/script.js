document.addEventListener("DOMContentLoaded", async () => {
    const DOM = getDOMElements();
    const {
        topBanner, bottomBanner, closeBtn, character, fireText, hat,
        introMusic, waitMusic, fireMusic, shotMusic, shotFallMusic,
        deathMusic, winMusic, restartButton, score
    } = DOM;

    const characters = getCharacters();
    let currentLevel = 0;

    let clickTimeout;
    let canClick = false;
    let kill = false;
    let totalScore = 0;
    let yourTime = 0;
    let startDate;
    let endDate;

    restartButton.addEventListener('click', restartGame);
    closeBtn.addEventListener("click", handleClose);
    document.querySelector(".next-level-btn").addEventListener("click", nextLevel);

    character.addEventListener("animationend", async (e) => {
        if (e.animationName === "move-to-center-from-left" || e.animationName === "move-to-center-from-right") {
            await handleReadyState();
        }
        if (e.animationName.includes("__duel")) {
            await handleDeath();
        }
        if (e.animationName === "move-to-left") {
            character.classList.remove("__leave");
            character.style.display = "none";
        }
    });

    character.addEventListener("click", handleCharacterClick);

    let direction = getRandomDirection();
    let walkAnim = walkReturn();



    function getDOMElements() {
        return {
            topBanner: document.querySelector(".top-banner"),
            bottomBanner: document.querySelector(".bottom-banner"),
            closeBtn: document.querySelector(".close-btn"),
            character: document.querySelector(".nigger-param"),
            fireText: document.querySelector(".fire-right-img"),
            hat: document.querySelector(".hat"),
            introMusic: document.querySelector("#intro-music"),
            waitMusic: document.querySelector("#wait-music"),
            fireMusic: document.querySelector("#fire-music"),
            shotMusic: document.querySelector("#shot-music"),
            shotFallMusic: document.querySelector("#shot-fall-music"),
            deathMusic: document.querySelector("#death-music"),
            winMusic: document.querySelector("#win-music"),
            restartButton: document.querySelector('.button-restart'),
            score: document.querySelector(".win-score")
        };
    }

    function getCharacters() {
        return [
            { name: "Billy The Kid", charClass: "nigga-level-1", hatClass: "nigga-level-1-hat", reactionTime: 1000, score: 1000, level: 1 },
            { name: "Jesse James", charClass: "nigga-level-2", reactionTime: 850, score: 2000, level: 2 },
            { name: "Doc Holliday", charClass: "nigga-level-3", hatClass: "nigga-level-3-hat", reactionTime: 700, score: 3000, level: 3 },
            { name: "Django", charClass: "nigga-level-4", hatClass: "nigga-level-4-hat", reactionTime: 500, score: 4000, level: 4 },
            { name: "nigga", charClass: "nigga-level-5", hatClass: "nigga-level-5-hat", reactionTime: 350, score: 5000, level: 5 }
        ];
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function calculateScore(score) {
        totalScore += score;
        bottomBanner.textContent = "Your score is: " + totalScore;
    }

    function calculateYourTime() {
        return endDate - startDate;
    }

    function displayTimes(niggaTime) {
        yourTime = calculateYourTime() / 1000;
        if (isNaN(yourTime) || yourTime < 0) yourTime = 0;
        niggaTime = niggaTime / 1000;
        topBanner.innerHTML = `Your time is: ${yourTime.toFixed(3)} sec<br>Nigga time is: ${niggaTime.toFixed(3)} sec`;
    }

    function scoreFunction() {
        return characters.find(ch => character.classList.contains(ch.charClass))?.score;
    }

    function getNTime() {
        return characters.find(ch => character.classList.contains(ch.charClass))?.reactionTime;
    }

    function walkReturn() {
        return `nigga-level-${currentLevel + 1}__walk 0.35s steps(3) infinite`;
    }

    function getRandomDirection() {
        return Math.random() < 0.5 ? "move-to-center-from-left" : "move-to-center-from-right";
    }

    async function handleReadyState() {
        introMusic.currentTime = 0;
        introMusic.pause();
        character.classList.remove("__walk");
        character.style.animation = "";
        character.classList.add("__standing");

        waitMusic.play();
        await delay(1000);
        character.classList.remove("__standing");
        character.classList.add("__ready");
        fireText.style.display = "flex";
        fireMusic.play();
        canClick = true;
        waitMusic.currentTime = 0;
        waitMusic.pause();

        startDate = Date.now();
        await delay(getNTime());
        if (!kill) {
            shotMusic.play();
            character.classList.remove("__ready");
            character.classList.add("__shooting");
            fireText.style.display = "none";
        }
        canClick = false;
    }

    async function handleDeath() {
        character.classList.remove("__shooting");
        character.classList.add("__standing");
        document.querySelector(".death-overlay").style.opacity = "1";
        displayTimes(getNTime());
        deathMusic.play();
        await delay(1000);
        const looseDiv = document.querySelector(".loose");
        looseDiv.style.display = "block";
        character.classList.remove("__standing");
        character.classList.add("__leave");
        restartButton.style.display = "block";
    }

    async function handleCharacterClick() {
        if (canClick) {
            endDate = Date.now();
            clearTimeout(clickTimeout);
            shotFallMusic.play();
            character.classList.remove("__ready");
            character.classList.add("__death");
            hat.style.display = "block";
            fireText.style.display = "none";
            canClick = false;
            kill = true;
            await delay(3500);
            winMusic.play();
            document.querySelector(".next-level-btn").style.display = "block";
            calculateScore(scoreFunction());
            displayTimes(getNTime());
            const victoryDiv = document.querySelector(".victory");
            victoryDiv.style.display = "flex";
            if (character.classList.contains("nigga-level-5")) {
                const victoryDiv = document.querySelector(".victory");
                victoryDiv.style.display = "flex";
                score.textContent = "Your score is: " + totalScore;
            }

        }
    }

    function handleClose() {
        document.querySelector(".main-container").style.display = 'none';
        introMusic.play();
        character.classList.add("nigga-level-1");
        character.classList.add("__walk");
        hat.classList.add("nigga-level-1-hat");
        displayTimes(getNTime());
    }

    function restartGame() {
        document.querySelector(".death-overlay").style.opacity = "0";
        const victoryDiv = document.querySelector(".victory");
        victoryDiv.style.display = "none";
        const looseDiv = document.querySelector(".loose");
        looseDiv.style.display = "none";
        deathMusic.pause();
        restartButton.style.display = 'none';
        character.style.display = 'block';
        if (character.classList.contains("__leave")) {
            character.classList.remove("__leave");
        }
        setTimeout(() => {
            character.classList.add("__walk");
            if (!character.classList.contains("nigga-level-1")) {
                walkAnim = walkReturn();
                direction = getRandomDirection();
                character.style.animation = `${walkAnim}, ${direction} 5s linear forwards`;
            }
            introMusic.play();
        }, 1000);
    }

    function nextLevel() {
        currentLevel++;
        const victoryDiv = document.querySelector(".victory");
        victoryDiv.style.display = "none";
        const looseDiv = document.querySelector(".loose");
        looseDiv.style.display = "none";
        if (currentLevel >= characters.length) {
            victory();
            return;
        }

        const next = characters[currentLevel];
        character.className = `nigger-param ${next.charClass}`;
        hat.className = next.hatClass ? `hat ${next.hatClass}` : 'hat';
        character.style.display = "block";
        hat.style.display = "none";
        fireText.style.display = "none";
        kill = false;
        document.querySelector(".next-level-btn").style.display = "none";
        document.querySelector(".win-container").style.display = "none";

        character.classList.add("__walk");
        walkAnim = walkReturn();
        direction = getRandomDirection();
        character.style.animation = `${walkAnim}, ${direction} 5s linear forwards`;
        introMusic.play();
        displayTimes(getNTime());
    }

    function victory() {
        document.querySelector(".next-level-btn").style.display = "none";
        document.querySelector(".win-container").style.display = "block";
    }
});
