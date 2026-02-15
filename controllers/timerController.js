// Placeholder function to generate a dynamic image URL (later we'll generate it)
const createTimer = (req, res) => {
    const { endDateTime, theme } = req.body;

    if (!endDateTime) {
        return res.status(400).json({ error: "endDateTime is required" });
    }

    // Generate a dummy image URL with a unique ID (to be implemented later)
    const timerId = Date.now();
    const imageUrl = `${process.env.BASE_URL}/images/${timerId}.gif?end=${encodeURIComponent(endDateTime)}`;


    res.status(201).json({
        timerId,
        imageUrl,
        message: "Timer created successfully",
    });
};

module.exports = { createTimer };
