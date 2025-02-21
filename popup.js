const display = document.getElementById("timer");
const startPauseButton = document.getElementById("start");
const resetButton = document.getElementById("reset");

function updateDisplay() {
    chrome.storage.local.get(["timeLeft"], (data) => {
        let timeLeft = data.timeLeft || 25 * 60;
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;
        display.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });
}

// Toggle start/pause
startPauseButton.addEventListener("click", () => {
    chrome.storage.local.get(["isRunning"], (data) => {
        if (data.isRunning) {
            chrome.runtime.sendMessage({ action: "pause" });
            startPauseButton.textContent = "Start";
        } else {
            chrome.runtime.sendMessage({ action: "start" });
            startPauseButton.textContent = "Pause";
        }
    });
});

// Reset timer
resetButton.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "reset" });
    startPauseButton.textContent = "Start";
    updateDisplay();
});

// Update display every second
setInterval(updateDisplay, 1000);
updateDisplay();