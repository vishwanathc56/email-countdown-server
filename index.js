const express = require("express");
const cors = require("cors");
//require("dotenv").config();
const timerRoutes = require("./routes/timerRoutes");
const { generateCountdownGIF } = require('./utils/gifGenerator');
const mongoose = require('mongoose');
const Timer = require('./models/Timer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("Email Countdown Generator API is running 🚀");
});

/* app.get('/images/:id.gif', (req, res) => {
    const endRaw = req.query.end;
    // const bgColor = req.query.bgColor || '#000';
    // const fontColor = req.query.fontColor || '#fff';
    // const fontSize = parseInt(req.query.fontSize) || 24;       // default 24px
    // const fontFamily = req.query.fontFamily || 'Arial';        // default Arial

    const width = parseInt(req.query.width) || 400;
    const height = parseInt(req.query.height) || 100;

    let {
        bgColor = '#000',
        fontColor = '#fff',
        fontSize = 24,
        fontFamily = 'Arial',
        theme
    } = req.query;
    fontSize = parseInt(fontSize);

    if (theme) {
        switch (theme.toLowerCase()) {
            case 'light':
                bgColor = '#ffffff';
                fontColor = '#000000';
                fontSize = 24;
                fontFamily = 'Georgia';
                break;
            case 'neon':
                bgColor = '#000000';
                fontColor = '#39ff14';
                fontSize = 26;
                fontFamily = 'Courier';
                break;
            case 'dark':
            default:
                bgColor = '#000000';
                fontColor = '#ffffff';
                fontSize = 24;
                fontFamily = 'Arial';
                break;
        }
    }


    const endTime = new Date(decodeURIComponent(endRaw));
    if (isNaN(endTime)) return res.status(400).send("Invalid end time");

    res.setHeader('Content-Type', 'image/gif');

    //const gifStream = generateCountdownGIF(endTime, 30, { bgColor });
    const gifStream = generateCountdownGIF(endTime, 30, {
        bgColor,
        fontColor,
        fontSize,
        fontFamily,
        width,
        height
    });
    gifStream.pipe(res);
}); */

app.get('/images/:id.gif', async (req, res) => {
    try {
        const Timer = require('./models/Timer');
        const timerId = req.params.id;

        const timer = await Timer.findById(timerId);
        if (!timer) {
            return res.status(404).send('Timer not found');
        }

        // Validate time
        if (timer.endDateTime < new Date()) {
            return res.status(400).send("Timer has already expired.");
        }

        res.setHeader('Content-Type', 'image/gif');

        const gifStream = generateCountdownGIF(
            timer.endDateTime,
            30,
            {
                bgColor: timer.bgColor,
                fontColor: timer.fontColor,
                fontSize: timer.fontSize,
                fontFamily: timer.fontFamily,
                width: timer.width,
                height: timer.height
            }
        );

        gifStream.pipe(res);

    } catch (err) {
        console.error('Error loading timer image:', err);
        res.status(500).send("Failed to load timer.");
    }
});


app.post('/api/saveTimer', async (req, res) => {
    try {
        const newTimer = new Timer(req.body);
        const savedTimer = await newTimer.save();
        res.status(201).json({
            timerId: savedTimer._id,
            message: 'Timer saved successfully'
        });
    } catch (err) {
        console.error('Error saving timer:', err);
        res.status(500).json({ error: 'Failed to save timer' });
    }
});

app.get('/api/timers', async (req, res) => {
    try {
        const Timer = require('./models/Timer');
        const timers = await Timer.find().sort({ createdAt: -1 }).limit(20);
        res.json(timers);
    } catch (err) {
        console.error('Error fetching timers:', err);
        res.status(500).json({ error: 'Failed to fetch timers' });
    }
});

app.delete('/api/timers/:id', async (req, res) => {
    try {
        const Timer = require('./models/Timer');
        const result = await Timer.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ error: 'Timer not found' });
        }

        res.json({ message: 'Timer deleted successfully' });
    } catch (err) {
        console.error('Error deleting timer:', err);
        res.status(500).json({ error: 'Failed to delete timer' });
    }
});

app.post('/api/login', (req, res) => {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    // Optional: Save user to DB here if needed

    res.status(200).json({
        message: 'Login successful',
        email,
        token: 'dummy-token-' + Date.now(), // for demo; replace with JWT later
    });
});

app.use("/api/timers", timerRoutes);

//mongoose.connect('mongodb://127.0.0.1:27017/emailCountdown', {
/* mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ MongoDB connected');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}); */
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000
})
    .then(() => {
        console.log("✅ MongoDB connected");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err);
    });


module.exports = app;

