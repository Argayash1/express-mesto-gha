const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users'); // импортируем роутер users.js
const cards = require('./routes/cards'); // импортируем роутер cards.js

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use((req, res, next) => {
  req.user = {
    _id: '6439cc795a2a1fb8080e67ce', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', users); // запускаем
app.use('/', cards); // запускаем

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});

// mongodb://localhost:27017
