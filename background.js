chrome.alarms.onAlarm.addListener(() => {
        chrome.notifications.create({
            type: "basic",
            iconUrl: "icon.png",
            title: "Pomodoro Done!",
            message: "Take a break!",
        });
});    