const jwt = require('jsonwebtoken');

// Импорт переменной секретного ключа
const { JWT_SECRET } = require('../utils/config');

module.exports = (req, res, next) => {
  // извлечём токен и сохраняем его в переменную
  const token = req.cookies.jwt;

  // убеждаемся, что он есть или начинается с Bearer
  if (!token) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
