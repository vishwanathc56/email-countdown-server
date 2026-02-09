const { createCanvas } = require("canvas");

function getTimeRemaining(endDate) {
    const total = Date.parse(endDate) - Date.now();
    if (total <= 0) return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { total, days, hours, minutes, seconds };
}

function generateCountdownImage(endDateTime) {
    const { days, hours, minutes, seconds } = getTimeRemaining(endDateTime);

    const canvas = createCanvas(400, 100);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 400, 100);

    // Text
    ctx.fillStyle = "#fff";
    ctx.font = "bold 24px Arial";
    ctx.fillText(`Time Left: ${days}d ${hours}h ${minutes}m ${seconds}s`, 50, 60);

    return canvas.toBuffer("image/png");
}

module.exports = { generateCountdownImage };
