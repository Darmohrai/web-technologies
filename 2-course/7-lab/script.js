document.addEventListener("DOMContentLoaded", async () => {
    const topBanner = document.querySelector(".top-banner");
    const bottomBanner = document.querySelector(".bottom-banner");
    const closeBtn = document.querySelector(".close-btn");
    const character = document.querySelector(".nigger-param");
    const fireText = document.querySelector(".fire-right-img");
    const hat = document.querySelector(".hat");
    const introMusic = document.querySelector("#intro-music");
    const waitMusic = document.querySelector("#wait-music");
    const fireMusic = document.querySelector("#fire-music");
    const shotMusic = document.querySelector("#shot-music");
    const shotFallMusic = document.querySelector("#shot-fall-music");
    const deathMusic = document.querySelector("#death-music");
    const winMusic = document.querySelector("#win-music");
    const restartButton = document.querySelector('.button-restart');


    restartButton.addEventListener('click', restartGame);

    const characters = [
        {
            name: "Billy The Kid",
            charClass: "nigga-level-1",
            hatClass: "nigga-level-1-hat",
            reactionTime: 1000,
            score: 1000
        },
        {
            name: "Jesse James",
            charClass: "nigga-level-2",
            reactionTime: 850,
            score: 2000
        },
        {
            name: "Doc Holliday",
            charClass: "nigga-level-3",
            hatClass: "nigga-level-3-hat",
            reactionTime: 700,
            score: 3000
        },
        {
            name: "Django",
            charClass: "nigga-level-4",
            hatClass: "nigga-level-4-hat",
            reactionTime: 500,
            score: 4000
        }
    ];
    let currentLevel = 0;


    let clickTimeout;
    let canClick = false;
    let kill = false;
    let totalScore = 0;
    let yourTime = 0;

    let startDate;
    let endDate;

    function calculateScore(score) {
        totalScore += score;
        bottomBanner.textContent = "Your score is: " + totalScore;
    }

    function time(niggaTime) {
        yourTime = calculateYourTime() / 1000;
        if (isNaN(yourTime) || yourTime < 0) {
            yourTime = 0;
        }
        niggaTime = niggaTime / 1000;
        topBanner.innerHTML = "Your time is: " + yourTime.toFixed(3) + " sec<br>" + "Nigga time is: " + niggaTime.toFixed(3) + " sec";
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    character.addEventListener("animationend", async (e) => {  // Використовуємо async функцію для анімації
        if (e.animationName === "move-to-center-from-left" || e.animationName === "move-to-center-from-right") {
            time(getNTime());
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
            if (kill === false) {
                shotMusic.play();
                character.classList.remove("__ready");
                character.classList.add("__shooting");
                fireText.style.display = "none";
            }
            canClick = false;
        }
    });

    character.addEventListener("animationend", async (e) => {
        if (e.animationName.includes("__duel")) {
            character.classList.remove("__shooting");
            character.classList.add("__standing");
            document.querySelector(".death-overlay").style.opacity = "1";
            time(getNTime());
            deathMusic.play();
            await delay(1000);
            character.classList.remove("__standing");
            character.classList.add("__leave");
            restartButton.style.display = "block";
        }
    })

    character.addEventListener("animationend", async (e) => {
        if (e.animationName === "move-to-left") {
            character.classList.remove("__leave");
            character.style.display = "none";
        }
    })

    character.addEventListener("click", async () => {
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
            time(getNTime());
        }
    });

    function removeMainContainer() {
        const container = document.querySelector(".main-container");
        if (container) {
            container.style.display = 'none';
        }
    }

    closeBtn.addEventListener("click", () => {
        removeMainContainer();
        introMusic.play();
        character.classList.add("nigga-level-1");
        character.classList.add("__walk");
        hat.classList.add("nigga-level-1-hat");
    })


    function scoreFunction() {
        if (character.classList.contains("nigga-level-1")) {
            return characters[0].score;
        }
        if (character.classList.contains("nigga-level-2")) {
            return characters[1].score;
        }
        if (character.classList.contains("nigga-level-3")) {
            return characters[3].score;
        }
        if (character.classList.contains("nigga-level-4")) {
            return characters[4].score;
        }
    }

    function getNTime() {
        if (character.classList.contains("nigga-level-1")) {
            return characters[0].reactionTime;
        }
        if (character.classList.contains("nigga-level-2")) {
            return characters[1].reactionTime;
        }
        if (character.classList.contains("nigga-level-3")) {
            return characters[2].reactionTime;
        }
        if (character.classList.contains("nigga-level-4")) {
            return characters[3].reactionTime;
        }
    }

    function calculateYourTime() {
        return endDate - startDate;
    }

    document.querySelector(".next-level-btn").addEventListener("click", () => {
        currentLevel++;

        if (currentLevel >= characters.length) {
            alert("You finished the game!");
            return;
        }

        const next = characters[currentLevel];
        character.className = `nigger-param ${next.charClass}`;
        if (next.hatClass) {
            hat.className = `hat ${next.hatClass}`;
        } else {
            hat.className = `hat`;
        }
        character.style.display = "block";
        hat.style.display = "none";
        fireText.style.display = "none";
        kill = false;

        document.querySelector(".next-level-btn").style.display = "none";

        character.classList.add("__walk");
        walkAnim = walkReturn();
        direction = Math.random() < 0.5 ? "move-to-center-from-left" : "move-to-center-from-right";
        character.style.animation = `${walkAnim}, ${direction} 5s linear forwards`;
        introMusic.play();

    });

    let direction = Math.random() < 0.5 ? "move-to-center-from-left" : "move-to-center-from-right";

    let walkAnim = walkReturn();

    function restartGame() {
        document.querySelector(".death-overlay").style.opacity = "0";
        deathMusic.pause();
        restartButton.style.display = 'none';
        if (character.classList.contains("__leave")) {
            character.classList.remove("__leave");
        } else {
            character.style.display = 'block';
        }
        setTimeout(() => {
            character.classList.add("__walk");
            if (!character.classList.contains("nigga-level-1")) {
                walkAnim = walkReturn();
                direction = Math.random() < 0.5 ? "move-to-center-from-left" : "move-to-center-from-right";
                character.style.animation = `${walkAnim}, ${direction} 5s linear forwards`;
            }
            introMusic.play();
        }, 1000);
    }

    function walkReturn(){
        if (character.classList.contains("nigga-level-2")) {
            return "nigga-level-2__walk 0.35s steps(3) infinite";
        }
        if (character.classList.contains("nigga-level-3")) {
            return "nigga-level-3__walk 0.35s steps(3) infinite";
        }
        if (character.classList.contains("nigga-level-4")) {
            return "nigga-level-4__walk 0.35s steps(3) infinite";
        }
        return "nigga-level-1__walk 0.35s steps(3) infinite";
    }
});
