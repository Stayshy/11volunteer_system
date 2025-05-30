const nodemailer = require('nodemailer');
const db = require('../config/db');

async function sendNotifications(eventId = null) {
    try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        const end = new Date(tomorrow);
        end.setDate(end.getDate() + 1);

        let query = 'SELECT e.title, e.date, v.email, v.name FROM events e JOIN participations p ON e.id = p.event_id JOIN volunteers v ON p.volunteer_id = v.id WHERE e.date >= $1 AND e.date < $2';
        let params = [tomorrow, end];

        if (eventId) {
            query = 'SELECT e.title, e.date, v.email, v.name FROM events e JOIN participations p ON e.id = p.event_id JOIN volunteers v ON p.volunteer_id = v.id WHERE e.id = $1';
            params = [eventId];
        }

        const result = await db.query(query, params);
        console.log(`Found ${result.rows.length} notifications to send${eventId ? ` for event ${eventId}` : ''}`);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'spijhonirogolubiro@gmail.com',
                pass: 'cmcg xudu bwqm edqi',
            },
        });

        let sentCount = 0;
        for (const row of result.rows) {
            try {
                await transporter.sendMail({
                    from: 'spijhonirogolubiro@gmail.com',
                    to: row.email,
                    subject: `Напоминание: ${row.title}`,
                    text: `Уважаемый(ая) ${row.name}, ${eventId ? 'напоминаем' : 'завтра'} ${new Date(row.date).toLocaleString('ru-RU')} состоится "${row.title}".`,
                });
                console.log(`Sent email to ${row.email} for ${row.title}`);
                sentCount++;
            } catch (emailError) {
                console.error(`Failed to send email to ${row.email}:`, emailError);
            }
        }

        return { message: `Sent ${sentCount} notifications`, count: sentCount, total: result.rows.length };
    } catch (error) {
        console.error('Error in sendNotifications:', error);
        throw error;
    }
}

module.exports = { sendNotifications };