const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'spijhonirogolubiro@gmail.com',
    pass: 'cmcg xudu bwqm edqi',
  },
});

const mailOptions = {
  from: 'spijhonirogolubiro@gmail.com',
  to: 'test@example.com', // Замените на ваш тестовый email
  subject: 'Тестовое письмо',
  text: 'Это тестовое письмо.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Ошибка:', error);
  } else {
    console.log('Письмо отправлено:', info.response);
  }
});