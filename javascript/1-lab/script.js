let messageBox = document.getElementsByClassName("message-box")[0];

messageBox.textContent = "Hello world!";

let button = document.getElementById("showNameBtn");

button.onmouseout = function () {
    console.error("Дармограй Вадим");
};
