const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const mongoose = require('mongoose');
const { errors } = require('celebrate');
const router = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express(); // Cоздаём приложение методом express

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
app.use(helmet());

app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

// роутер
app.use(router);

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
