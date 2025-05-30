const db = require('../config/db');

const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ message: 'Пустое сообщение' });
        }

        // Поиск мероприятий
        const search = `%${message}%`;
        let events = [];
        const result = await db.query(
            'SELECT title, date, description FROM events WHERE title ILIKE $1 AND date > CURRENT_TIMESTAMP',
            [search]
        );
        events = result.rows.map(row => ({
            title: row.title,
            date: row.date.toISOString().split('T')[0], // Форматируем дату в YYYY-MM-DD
            description: row.description || 'Описание отсутствует'
        }));

        if (!events.length) {
            const popular = await db.query(
                'SELECT title, date, description FROM events WHERE date > CURRENT_TIMESTAMP ORDER BY date ASC LIMIT 5'
            );
            events = popular.rows.map(row => ({
                title: row.title,
                date: row.date.toISOString().split('T')[0],
                description: row.description || 'Описание отсутствует'
            }));
        }

        const eventsList = events.length
            ? events.map(e => `${e.title} (${e.date})`).join(', ')
            : 'нет доступных мероприятий';
        const prompt = `Отвечай кратко, только на русском языке, в виде списка (каждый пункт начинается с "- "). 
Если пользователь запрашивает ближайшие мероприятия (например, "три ближайших мероприятия"), выбери ровно три мероприятия с самыми ранними датами из списка: ${eventsList}. 
Указывай название и дату в формате (YYYY-MM-DD). 
Если мероприятий меньше трёх, перечисли все доступные. 
Если запрос тематический (например, про экологию или волонтёрство), анализируй описания мероприятий из: ${JSON.stringify(events.map(e => ({title: e.title, description: e.description})))} и рекомендуй до трёх мероприятий, соответствующих теме, с указанием дат. 
Если пользователь спрашивает подробности о мероприятии, используй описание из того же JSON. 
Для общих вопросов или если запрос не соответствует темам, выбери до трёх ближайших мероприятия или ответь "- Нет подходящего мероприятия". 
Избегай лишних слов и объяснений.`;

        // Запрос к Intelligence API
        const apiKey = 'io-v2-eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvd25lciI6IjI2M2ZjOWY4LTMwZDQtNDkwNS05MmIwLThiYzIxOWNmMDdhMyIsImV4cCI6NDkwMjE3NzMwNH0.Pj5kLLch697EZqsYgoFDv6sIjZ1fHysYk-7xGXwlQhmJKdkWY9VcsAvSi0MdHzxDe0zWAqzrCrV2viBI2Q7j2w';
        const fetch = (await import('node-fetch')).default; // Динамический импорт
        const response = await fetch('https://api.intelligence.io.solutions/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                model: 'deepseek-ai/DeepSeek-R1',
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: message },
                ],
                temperature: 0.7,
                max_completion_tokens: 200,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error('API Error:', data);
            return res.status(response.status).json({ message: `Ошибка API: ${data.error?.message || 'Неизвестная ошибка'}` });
        }

        let botResponse = data.choices?.[0]?.message?.content || 'Ошибка ответа';
        const contentParts = botResponse.split('</think>\n\n');
        botResponse = contentParts[1] || contentParts[0];

        res.status(200).json({ response: botResponse });
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ message: 'Ошибка сервера', error: error.message });
    }
};

module.exports = { sendMessage };