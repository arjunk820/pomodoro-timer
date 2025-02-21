let timeLeft = 25 * 60; // 25 minutes
let isRunning = false;

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ timeLeft, isRunning: false });
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "pomodoroTimer") {
        chrome.storage.local.get(["timeLeft", "isRunning"], (data) => {
            if (data.isRunning && data.timeLeft > 0) {
                timeLeft = data.timeLeft - 1;
                chrome.storage.local.set({ timeLeft });

                // Update badge text
                let minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                chrome.action.setBadgeText({ text: `${minutes}:${seconds < 10 ? '0' : ''}${seconds}` });

                if (timeLeft === 0) {
                    chrome.notifications.create({
                        type: "basic",
                        iconUrl: "icon.png",
                        title: "Time's up!",
                        message: "Take a break!"
                    });
                    chrome.storage.local.set({ isRunning: false });
                }
            }
        });
    }
});

function startTimer() {
    chrome.storage.local.set({ isRunning: true });
    chrome.alarms.create("pomodoroTimer", { periodInMinutes: 1 / 60 }); // Run every second
}

function pauseTimer() {
    chrome.storage.local.set({ isRunning: false });
    chrome.alarms.clear("pomodoroTimer");
}

function resetTimer() {
    chrome.storage.local.set({ timeLeft: 25 * 60, isRunning: false });
    chrome.alarms.clear("pomodoroTimer");
    chrome.action.setBadgeText({ text: "" });
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "start") startTimer();
    if (message.action === "pause") pauseTimer();
    if (message.action === "reset") resetTimer();
    sendResponse({ status: "ok" });
});  