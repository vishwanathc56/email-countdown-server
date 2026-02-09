const { createCanvas } = require('canvas');
const GIFEncoder = require('gifencoder');

function getTimeRemaining(target, now) {
    const total = target - now;
    if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return { days, hours, minutes, seconds };
}

function generateCountdownGIF(endTime, durationSeconds = 30, options = {}) {
    const width = options.width || 400;
    const height = options.height || 100;
    const encoder = new GIFEncoder(width, height);
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');


    const stream = encoder.createReadStream();

    encoder.start();
    encoder.setRepeat(0);
    encoder.setDelay(1000); // 1 frame per second
    encoder.setQuality(10);

    for (let i = 0; i < durationSeconds; i++) {
        const now = Date.now() + i * 1000;
        const remaining = getTimeRemaining(endTime.getTime(), now);

        const bgColor = options.bgColor || '#000';
        const fontColor = options.fontColor || '#fff';
        const fontSize = options.fontSize || 24;
        const fontFamily = options.fontFamily || 'Arial';


        // Inside the loop, before drawing text
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, width, height);


        // ctx.fillStyle = '#000';
        // ctx.fillRect(0, 0, width, height);

        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = fontColor;
        ctx.fillText(
            `Time Left: ${remaining.days}d ${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`,
            40,
            60
        );



        encoder.addFrame(ctx);
    }

    encoder.finish();
    return stream;
}

module.exports = { generateCountdownGIF };
