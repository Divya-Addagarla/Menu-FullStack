const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const admin = require('firebase-admin');


const TELEGRAM_TOKEN = '8072387124:AAHBNAeYT04JGBoarLJMTn5qtQzuBws2eJ8';
const OMDB_API_KEY = '75009f15';

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();


const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });


bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const movieName = msg.text;

  if (movieName === '/start') {
    bot.sendMessage(
      chatId,
      '🎬 Welcome!\nSend me any movie name to get its details.'
    );
    return;
  }

  try {
    const response = await axios.get(
      `https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${OMDB_API_KEY}`
    );

    const data = response.data;

    if (data.Response === 'True') {

      
      await db.collection('movieSearches').add({
        userId: msg.from.id,
        username: msg.from.username || "NoUsername",
        searchedMovie: movieName,
        title: data.Title,
        year: data.Year,
        imdbRating: data.imdbRating,
        genre: data.Genre,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      bot.sendMessage(
        chatId,
        `🎥 *${data.Title}* (${data.Year})\n⭐ Rating: ${data.imdbRating}\n🎭 Genre: ${data.Genre}\n📝 Plot: ${data.Plot}\n\n📌 Data saved to Firestore`,
        { parse_mode: 'Markdown' }
      );

    } else {
      bot.sendMessage(chatId, '❌ Movie not found. Try another name.');
    }

  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, '⚠️ Something went wrong. Please try again.');
  }
});