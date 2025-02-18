let timer;
let timeLeft = 25 * 60;
let isPaused = true; // tracks if the timer is paused/not

const display = document.getElementById("timer");
const startPauseButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function toggleTimer() {
    if (isPaused) {
        // Start the timer
        isPaused = false;
        startPauseButton.textContent = "Pause"; // Change button text
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                timer = null;
                isPaused = true;
                startPauseButton.textContent = "Start";
                chrome.notifications.create({
                    type: "basic",
                    iconUrl: "icon.png",
                    title: "Time's up!",
                    message: "Take a break!"
                });
            }
        }, 1000);
    } else {
        // Pause the timer
        isPaused = true;
        clearInterval(timer);
        timer = null;
        startPauseButton.textContent = "Start"; // Change button text
    }
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    timeLeft = 25 * 60;
    updateDisplay();
}

startPauseButton.addEventListener("click", toggleTimer);
resetButton.addEventListener("click", resetTimer);

updateDisplay();