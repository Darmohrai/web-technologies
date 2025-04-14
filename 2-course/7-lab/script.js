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

    let clickTimeout;
    let canClick = false;
    let kill = false;
    let totalScore = 0;
    let yourTime = 0;

    let startDate;
    let endDate;

    function calculateScore(score) {
        totalScore += score;
        bottomBanner.textContent = "Your score is: " + score;
    }

    function time(niggaTime) {
        yourTime = calculateYourTime() / 1000;
        if (isNaN(yourTime)) {
            yourTime = 0;
        }
        niggaTime = niggaTime / 1000;
        topBanner.innerHTML = "Your time is: " + yourTime.toFixed(3) + "s<br>" + "Nigga time is: " + niggaTime.toFixed(3) + "s";
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    character.addEventListener("animationend", async (e) => {  // Використовуємо async функцію для анімації
        if (e.animationName === "move-to-center") {
            time(getNTime());
            introMusic.currentTime = 0;
            introMusic.pause();
            character.classList.remove("__walk");
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
            deathMusic.play();
            await delay(1000);
            character.classList.remove("__standing");
            character.classList.add("__leave");
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
            return 1000;
        }
    }

    function getNTime() {
        if (character.classList.contains("nigga-level-1")) {
            return 1000;
        }
    }

    function calculateYourTime() {
        return endDate - startDate;
    }
});
