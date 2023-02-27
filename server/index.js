const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.log(`MongoDB connection error: ${err}`);
});

// Создание схемы сообщения
const messageSchema = new mongoose.Schema({
  author: String,
  text: String,
  createdAt: { type: Date, default: Date.now }
});

// Создание схемы пользователя
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

// Создание модели сообщения
const Message = mongoose.model('Message', messageSchema);

// Создание модели пользователя
const User = mongoose.model('User', userSchema);

// Middleware для обработки запросов с данными в формате JSON
app.use(express.json());

// Middleware для обработки CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Обработчик для получения списка сообщений
app.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find();
    res.send(messages);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Обработчик для добавления нового сообщения
app.post('/messages', async (req, res) => {
  const message = new Message({
    author: req.body.author,
    text: req.body.text
  });

  try {
    await message.save();
    res.send(message);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Обработчик для создания нового пользователя
app.post('/users', async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server started on port 3000');
});