const eventModel = require('../models/eventModel');

const getEvents = async (req, res) => {
    try {
        const events = await eventModel.getAllEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createEvent = async (req, res) => {
    const { title, description, date, max_participants, organizer_id } = req.body;
    try {
        const newEvent = await eventModel.addEvent(title, description, date, max_participants, organizer_id);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request' });
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, max_participants, organizer_id } = req.body;
    try {
        const updatedEvent = await eventModel.updateEvent(id, title, description, date, max_participants, organizer_id);
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request' });
    }
};

const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
        await eventModel.deleteEvent(id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: 'Event not found' });
    }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };