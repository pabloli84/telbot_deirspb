let TelegramBot = require('node-telegram-bot-api');
let botOptions = {
    polling: true
};

let fs = require('fs');

let content = fs.readFileSync('./config.json');
let config = JSON.parse(content);
let token = config.ApiToken;
const paymentMethodsFile = "./paymentMethods.json";
const helpFile = "./help.md";

//Info links const's
const scheduleURL = "http://spb-deir.ru/schedule/";
const spbEmail = "spb@deir.org";
const linkVKClub = "https://vk.com/club18968768";
const linkFBGroup = "http://facebook.com/deirspb";
const linkRegForSeminar = "http://spb-deir.ru/wp-content/plugins/formcraft/form.php?id=1";
const linkCourse12El = "https://www.ozon.ru/context/detail/id/143770484/";
const linkCourse34El = "https://www.ozon.ru/context/detail/id/143647781/";
const linkCourse12Paper = "https://www.ozon.ru/context/detail/id/143765992/";
const linkCourse34Paper = "https://www.ozon.ru/context/detail/id/143653923/";

let bot = new TelegramBot(token, botOptions);

bot.getMe().then(function(me)
		 {
		     console.log('Hello! My name is %s!', me.first_name);
		     console.log('My id is %s.', me.id);
		     console.log('And my username is @%s.', me.username);
		 });

bot.on('text', function(msg)
       {
	   let messageChatId = msg.chat.id;
	   let messageText = msg.text.split(" ");
	   let messageDate = msg.date;
	   let messageUsr = msg.from.username;
	   let messageCmd = msg.text.split(" ");
	   let options;

	   switch (String(messageText[0])) {
        case '/start':
          options = {
            reply_markup: JSON.stringify({
              keyboard: [
                ['Способы оплаты'],
                ['Регистрация на семинар']
              ],
              resize_keyboard: true
            })
          };
          this.sendMessage(messageChatId, "ДЭИР СПб Бот приветствует тебя!\nНабери /help, чтобы узнать, что я могу!" /*, options*/);
               break;
        case '/say':
	       sendMessageByBot(messageChatId, "Hello World");
               break;
	      case '/showpaymentoptions':
            options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Сбербанк', callback_data: "sber"}],
                [{text: 'Альфабанк', callback_data: "alpha"}],
                [{text: 'Безнал', callback_data: "beznal"}]
              ],
              resize_keyboard: true
            })
          };
          bot.sendMessage(messageChatId, "Выберете способ оплаты:", options);
	             break;
        case '/help':
          fs.readFile(helpFile, function (err, data) {
            if (!err) {
              bot.sendMessage(messageChatId, data, {parse_mode: "Markdown"});
            } else {
                console.log(err);
            }
          });
            break;
        case '/info':
          //sendMessageByBot(messageChatId, "Я пока изучаю этот вопрос :)");
          options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: "Расписание", url: scheduleURL}],
                //[{text: "E-mail", url: spbEmail}],
                [{text: "VK", url: linkVKClub}],
                [{text: "Facebook", url: linkFBGroup}],
                [{text: "Регистрация на семинар", url: linkRegForSeminar}],
                [{text: "Книги", callback_data: "books"}]
              ]
            })
          };
          bot.sendMessage(messageChatId, "Располагаю следующей информацией:", options);
          break;

	   default:
	       sendMessageByBot(messageChatId, "I can't answer this :(");
	             break;
	   }

	   console.log(msg);
       });

bot.on('callback_query', function onCallbackQuery(callbackQuery){
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id
  };
  if (action === 'books') {
    let keyboard = {
      reply_markup: JSON.stringify({
        inline_keyboard: [
          [{text: "Полный учебный курс 1-2 ступени (E-Book)", url:linkCourse12El},
           {text: "Полный учебный курс 3-4 ступени (E-Book)", url:linkCourse34El}],
          [{text: "Полный учебный курс по 1-2 ступени (Бумага)", url:linkCourse12Paper},
           {text: "Полный учебный курс по 3-4 ступени (Бумага)", url:linkCourse34Paper}]
        ]
      }),
      chat_id: msg.chat.id,
      message_id: msg.message_id
    };
    bot.editMessageText("Ссылки на электронные и бумажные книги", keyboard);
  } else {
    bot.editMessageText(showPaymentMethods(action), opts);
  }
});

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}

function showPaymentMethods(aPaymentMethod) {
      let pMethods = JSON.parse(fs.readFileSync(paymentMethodsFile));
      let pMethodsList = Object.keys(pMethods);

      //console.log("Выбранный метод оплаты: " + aPaymentMethod);
      //if (aPaymentMethod === null) return "Укажите один из доступных методов оплаты: " + pMethodsList;

      if (pMethods[aPaymentMethod]) {
        return pMethods[aPaymentMethod];
      } else {
        return "Доступны следующие методы оплаты: " + pMethodsList + '\n' + "Например, /payment_methods sber";
      }
}
