import express from 'express';
import axios from 'axios';
import TelegramBot from 'node-telegram-bot-api';
import cron from 'node-cron';

const app = express();

const constants = {
  AUTH_URL: 'https://apiapp.acb.com.vn/mb/auth/tokens',
  NOTIFY_URL: 'https://apiapp.acb.com.vn/mb/legacy/ss/cs/bankservice/v2/notifications?page=0&size=20&language=en',
  READ_NOTIFY_URL: (id) => `https://apiapp.acb.com.vn/mb/legacy/ss/cs/bankservice/v2/notification/${id}`,
  CLIENT_ID: 'iuSuHYVufIUuNIREV0FB9EoLn9kHsDbm',
  TG_BOT_TOKEN: '',
  BANK_ID: '',
  BANK_PWD: '',
};

const credentials = {
  username: constants.BANK_ID,
  password: constants.BANK_PWD,
  clientId: constants.CLIENT_ID
}

const bot = new TelegramBot(constants.TG_BOT_TOKEN, { polling: true });

const headers = {};

let latestId = '';

cron.schedule('*/3 * * * * *', async () => {
  console.log('running a task every 3 second');
  const notify = await getNotify();
  notify.data = notify.data.filter(item => item.amount !== "0");
  let message = notify.data[0].message.replace(/So\sdu\s\S*/, 'So du: ****.');
  const splitMessage = message.split('.');
  message = `${splitMessage[0].trim()}\n${splitMessage[1].trim()}\n${splitMessage[2].trim()}`;
  if (latestId !== notify.data[0].id) {
    console.log('sent message');
    bot.sendMessage('', message);
    latestId = notify.data[0].id;
  }
})

const login = async (credentials) => {
  const response = await axios.post(constants.AUTH_URL, credentials);
  headers.authorization = 'bearer ' + response.data.accessToken;
  return response;
}

const getNotify = async () => {
  const response = await axios.get(constants.NOTIFY_URL, { headers });
  return response.data;
}

const readNofity = async (id) => {
  await axios.put(constants.READ_NOTIFY_URL(id), { headers });
  return;
}

app.listen(process.env.PORT || 8080, async () => {
  await login(credentials);
  console.log('listening on port 8080');
});
