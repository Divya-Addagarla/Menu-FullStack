const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const TELEGRAM_TOKEN = '8247402617:AAFFlVlK5bzaDIOjnpPwr1NVqCtrQH3vlek';
const OMDB_API_KEY = '75009f15';

 bot = new TelegramBot(TELEconstGRAM_TOKEN, { polling: true });

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const movieName = msg.text;

  console.log('User sent:', movieName); 

  if (movieName === '/start') {
    bot.sendMessage(chatId, '🎬 Welcome! Send me any movie name to get its details.');
    return;
  }

  try {
    const response = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(movieName)}&apikey=${OMDB_API_KEY}`);
    console.log('Response:', response.data); 

    const data = response.data;

    if (data.Response === 'True') {
      bot.sendMessage(chatId, 
        `🎥 *${data.Title}* (${data.Year})\n⭐ Rating: ${data.imdbRating}\n🎭 Genre: ${data.Genre}\n📝 Plot: ${data.Plot}`,
        { parse_mode: 'Markdown' }
      );
    } else {
      bot.sendMessage(chatId, ' Movie not found. Try another name.');
    }
  } catch (error) {
    console.error('Error:', error.message);
    bot.sendMessage(chatId, ' Something went wrong. Please try again.');
  }
});