document.addEventListener("DOMContentLoaded", () => {
    const lamp = document.getElementById("lamp");
    const toggleButton = document.getElementById("toggleLamp");
    const lampTypeSelect = document.getElementById("lampType");
    const brightnessButton = document.getElementById("setBrightness");
    let timeoutId;

    function turnOn() {
        lamp.classList.add("on");
        resetAutoOff();
    }

    function turnOff() {
        lamp.classList.remove("on");
    }

    function toggleLamp() {
        if (lamp.classList.contains("on")) {
            turnOff();
        } else {
            turnOn();
        }
    }

    function changeLampType() {
        const selectedType = lampTypeSelect.value;
        lamp.className = `lamp ${selectedType}`;
        resetAutoOff();
    }

    function setBrightness() {
        const brightness = prompt("Введіть рівень яскравості (0-100):");
        if (brightness !== null && brightness >= 0 && brightness <= 100) {
            lamp.style.opacity = brightness / 100;
            resetAutoOff();
        } else {
            alert("Некоректне значення!");
        }
    }

    function resetAutoOff() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(turnOff, 10 * 1000);

    }

    toggleButton.addEventListener("click", toggleLamp);
    lampTypeSelect.addEventListener("change", changeLampType);
    brightnessButton.addEventListener("click", setBrightness);
});

