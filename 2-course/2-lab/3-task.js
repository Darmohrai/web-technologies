function getGradeIf(score) {
    if (score >= 90) {
        return "відмінно";
    } else if (score >= 75) {
        return "добре";
    } else if (score >= 60) {
        return "задовільно";
    } else {
        return "незадовільно";
    }
}

function getGrade(score) {
    return score >= 90 ? "відмінно" :
        score >= 75 ? "добре" :
            score >= 60 ? "задовільно" : "незадовільно";
}

function showGrade() {
    let score = document.getElementById("score").value;
    document.getElementById("gradeResult").innerText = getGrade(Number(score));
}


function getSeasonIf(month) {
    month = month.toLowerCase();
    if (month === "грудень" || month === "січень" || month === "лютий") {
        return "зима";
    } else if (month === "березень" || month === "квітень" || month === "травень") {
        return "весна";
    } else if (month === "червень" || month === "липень" || month === "серпень") {
        return "літо";
    } else if (month === "вересень" || month === "жовтень" || month === "листопад") {
        return "осінь";
    } else {
        return "невідомий місяць";
    }
}

function getSeason(month) {
    month = month.toLowerCase();
    return (month === "грудень" || month === "січень" || month === "лютий") ? "зима" :
        (month === "березень" || month === "квітень" || month === "травень") ? "весна" :
            (month === "червень" || month === "липень" || month === "серпень") ? "літо" :
                (month === "вересень" || month === "жовтень" || month === "листопад") ? "осінь" :
                    "невідомий місяць";
}

function showSeason() {
    let month = document.getElementById("month").value;
    document.getElementById("seasonResult").innerText = getSeason(month);
}