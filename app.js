const express = require('express');

const mongoose = require('mongoose');
const router = require('./routes/index');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express(); // Cоздаём приложение методом express

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   req.user = {
//     _id: '6447e42f95bb27881a275f32',
// вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.use(router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
