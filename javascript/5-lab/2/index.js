let durations = { red: 5000, yellow: 3000, green: 7000 };
let states = ["red", "yellow", "green", "blinkingYellow"];
let currentIndex = 0;
let timeoutId;

function changeLight(state) {
    document.querySelectorAll(".light").forEach(light => light.classList.remove("red", "yellow", "green", "blink"));

    if (state === "blinkingYellow") {
        document.getElementById("yellow").classList.add("blink");
        timeoutId = setTimeout(nextState, 3000);
    } else {
        document.getElementById(state).classList.add(state);
        timeoutId = setTimeout(nextState, durations[state]);
    }
    document.querySelector("h1").textContent = "Поточний стан: " + state;
}

function nextState() {
    currentIndex = (currentIndex + 1) % states.length;
    changeLight(states[currentIndex]);
}

function setDurations() {
    let redTime = prompt("Введіть тривалість червоного світла (мс):", durations.red);
    let yellowTime = prompt("Введіть тривалість жовтого світла (мс):", durations.yellow);
    let greenTime = prompt("Введіть тривалість зеленого світла (мс):", durations.green);

    if (redTime && yellowTime && greenTime) {
        durations.red = parseInt(redTime);
        durations.yellow = parseInt(yellowTime);
        durations.green = parseInt(greenTime);
        alert("Тривалість змінена!");
    }
}

document.getElementById("nextState").addEventListener("click", () => {
    clearTimeout(timeoutId);
    nextState();
});

document.getElementById("setDurations").addEventListener("click", setDurations);

changeLight(states[currentIndex]);