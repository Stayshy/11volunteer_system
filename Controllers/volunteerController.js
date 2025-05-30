const volunteerModel = require('../models/volunteerModel');

const getVolunteers = async (req, res) => {
    try {
        const volunteers = await volunteerModel.getAllVolunteers();
        res.status(200).json(volunteers);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createVolunteer = async (req, res) => {
    const { name, email, phone } = req.body;
    try {
        const newVolunteer = await volunteerModel.addVolunteer(name, email, phone);
        res.status(201).json(newVolunteer);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request' });
    }
};

const updateVolunteer = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
    try {
        const updatedVolunteer = await volunteerModel.updateVolunteer(id, name, email, phone);
        if (!updatedVolunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.status(200).json(updatedVolunteer);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request' });
    }
};

const deleteVolunteer = async (req, res) => {
    const { id } = req.params;
    try {
        await volunteerModel.deleteVolunteer(id);
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: 'Volunteer not found' });
    }
};

const getTopVolunteers = async (req, res) => {
    try {
        const query = `
            SELECT v.id, v.name, COALESCE(SUM(r.hours_worked), 0) as total_hours
            FROM volunteers v
            LEFT JOIN reports r ON v.id = r.volunteer_id
            GROUP BY v.id, v.name
            ORDER BY total_hours DESC
            LIMIT 5
        `;
        const result = await volunteerModel.query(query);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching top volunteers:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getVolunteers, createVolunteer, updateVolunteer, deleteVolunteer, getTopVolunteers };