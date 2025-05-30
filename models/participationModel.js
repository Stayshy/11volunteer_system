const db = require('../config/db');

const addParticipation = async (volunteer_id, event_id) => {
    const countResult = await db.query(
        'SELECT COUNT(*) FROM participations WHERE event_id = $1',
        [event_id]
    );
    const maxParticipants = await db.query(
        'SELECT max_participants FROM events WHERE id = $1',
        [event_id]
    );

    if (parseInt(countResult.rows[0].count) >= maxParticipants.rows[0].max_participants) {
        throw new Error('Event is full');
    }

    const result = await db.query(
        'INSERT INTO participations (volunteer_id, event_id) VALUES ($1, $2) RETURNING *',
        [volunteer_id, event_id]
    );
    return result.rows[0];
};

const deleteParticipation = async (volunteer_id, event_id) => {
    await db.query(
        'DELETE FROM participations WHERE volunteer_id = $1 AND event_id = $2',
        [volunteer_id, event_id]
    );
};

module.exports = { addParticipation, deleteParticipation };