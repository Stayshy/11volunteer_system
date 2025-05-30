const { sendNotifications } = require('../utils/notifier');

const send = async (req, res) => {
    try {
        const eventId = req.body.event_id;
        const result = await sendNotifications(eventId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to send notifications', error: error.message });
    }
};

module.exports = { send };