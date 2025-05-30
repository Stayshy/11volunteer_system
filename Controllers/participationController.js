const participationModel = require('../models/participationModel');

const createParticipation = async (req, res) => {
    const { volunteer_id, event_id } = req.body;
    try {
        const newParticipation = await participationModel.addParticipation(volunteer_id, event_id);
        res.status(201).json(newParticipation);
    } catch (error) {
        if (error.message === 'Event is full') {
            return res.status(409).json({ message: 'Event is full' });
        }
        res.status(400).json({ message: 'Invalid request' });
    }
};

const deleteParticipation = async (req, res) => {
    const { volunteer_id, event_id } = req.body;
    try {
        await participationModel.deleteParticipation(volunteer_id, event_id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: 'Participation not found' });
    }
};

module.exports = { createParticipation, deleteParticipation };