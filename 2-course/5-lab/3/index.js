function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    let minutes = now.getMinutes().toString().padStart(2, '0');
    let seconds = now.getSeconds().toString().padStart(2, '0');

    const timeString = `${hours}:${minutes}:<span class="blink">${seconds}</span>`;
    document.getElementById('clock').innerHTML = timeString;
}
setInterval(updateClock, 1000);

function startCountdown() {
    const targetDate = new Date(document.getElementById('timerInput').value);
    const countdownElement = document.getElementById('countdown');

    const interval = setInterval(function() {
        const now = new Date();
        const timeLeft = targetDate - now;

        if (timeLeft <= 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "Таймер закінчився!";
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days} днів, ${hours} годин, ${minutes} хвилин, ${seconds} секунд`;
        }
    }, 1000);
}
document.getElementById('timerInput').addEventListener('change', startCountdown);

function updateCalendar() {
    const monthInput = document.getElementById('monthInput').value;
    const month = new Date(monthInput);
    const monthName = month.toLocaleString('uk-UA', { month: 'long' });
    const year = month.getFullYear();
    document.getElementById('monthDisplay').innerHTML = `${monthName} ${year}`;
}
document.getElementById('monthInput').addEventListener('input', updateCalendar);

function calculateBirthdayCountdown() {
    const birthday = new Date(document.getElementById('birthdayInput').value);
    const now = new Date();
    const nextBirthday = new Date(now.getFullYear(), birthday.getMonth(), birthday.getDate());

    if (nextBirthday < now) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }

    const timeLeft = nextBirthday - now;
    const daysLeft = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hoursLeft = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('birthdayCountdown').innerHTML = `
                До вашого дня народження залишилось:
                ${daysLeft} днів, ${hoursLeft} годин, ${minutesLeft} хвилин, ${secondsLeft} секунд
            `;
}
document.getElementById('birthdayInput').addEventListener('change', calculateBirthdayCountdown);
