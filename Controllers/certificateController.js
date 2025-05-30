const db = require('../config/db');
const PDFDocument = require('pdfkit');

const getCertificate = async (req, res) => {
    try {
        const { volunteer_id, event_id } = req.query;
        if (!volunteer_id || !event_id) {
            return res.status(400).json({ error: 'Укажите ID волонтёра и мероприятия' });
        }

        const volunteer = await db.query('SELECT name FROM volunteers WHERE id = $1', [volunteer_id]);
        if (!volunteer.rows[0]) {
            return res.status(404).json({ error: 'Волонтёр не найден' });
        }

        const event = await db.query(
            'SELECT e.title, e.date, o.name as organizer_name FROM events e JOIN organizers o ON e.organizer_id = o.id WHERE e.id = $1',
            [event_id]
        );
        if (!event.rows[0]) {
            return res.status(404).json({ error: 'Мероприятие не найдено' });
        }

        const registration = await db.query(
            'SELECT hours_worked as hours FROM reports WHERE volunteer_id = $1 AND event_id = $2',
            [volunteer_id, event_id]
        );
        if (!registration.rows[0]) {
            return res.status(404).json({ error: 'Регистрация не найдена' });
        }

        const data = {
            volunteer_name: volunteer.rows[0].name,
            event_title: event.rows[0].title,
            organizer_name: event.rows[0].organizer_name,
            event_date: new Date(event.rows[0].date).toLocaleDateString('ru-RU'),
            hours: registration.rows[0].hours,
            issue_date: new Date().toLocaleDateString('ru-RU'),
        };

        console.log('Certificate data:', data);

        // Создание PDF
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=certificate_${volunteer_id}_${event_id}.pdf`);
        doc.pipe(res);

        // Используем встроенный шрифт Times-Roman для поддержки кириллицы
        doc.font('Times-Roman');

        // Основной текст
        doc.fontSize(28).fillColor('#2c3e50').text('Грамота', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(18).text(`Награждается ${data.volunteer_name}`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(16).text(`За участие в мероприятии "${data.event_title}"`, { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Дата проведения: ${data.event_date}`, { align: 'center' });
        doc.text(`Отработано часов: ${data.hours}`, { align: 'center' });
        doc.moveDown();
        doc.text(`Организатор: ${data.organizer_name}`, { align: 'center' });
        doc.moveDown();
        doc.text(`Дата выдачи: ${data.issue_date}`, { align: 'center' });

        // Подпись "Волонтёрский портал"
        doc.moveDown(4);
        doc.fontSize(10).fillColor('#7f8c8d').text('Волонтёрский портал', { align: 'center' });

        doc.end();
    } catch (error) {
        console.error('Certificate error:', error);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
};

module.exports = { getCertificate };