const reportModel = require('../models/reportModel');
const db = require('../config/db');

const getReports = async (req, res) => {
    try {
        const reports = await reportModel.getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const createReport = async (req, res) => {
    const { volunteer_id, event_id, description, hours_worked } = req.body;
    try {
        const newReport = await reportModel.addReport(volunteer_id, event_id, description, hours_worked);
        res.status(201).json(newReport);
    } catch (error) {
        res.status(400).json({ message: 'Invalid request' });
    }
};

const getStats = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'SELECT v.name, COUNT(p.id) as events_attended, COALESCE(SUM(r.hours_worked), 0) as total_hours FROM volunteers v LEFT JOIN participations p ON v.id = p.volunteer_id LEFT JOIN reports r ON v.id = r.volunteer_id WHERE v.id = $1 GROUP BY v.id, v.name',
            [id]
        );
        console.log('Stats result:', result.rows);
        res.status(200).json(result.rows[0] || { error: 'Волонтёр не найден' });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getReports, createReport, getStats };