
const url = process.env.APP_URL;
const port = process.env.PORT;
const environment = process.env.ENVIRONMENT;
const util = require("util");

const fs = require('fs');
const emailSender = require('./sendmail');

const token = process.env.API_TOKEN;
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

let TelegramBot = require('node-telegram-bot-api');
let botOptions;
let bot;

if (environment === "DEV") {
    botOptions = {
        polling: true
    };
    bot = new TelegramBot(token, botOptions);
} else if (environment === "PROD"){
    botOptions = {
        webhook: {
            port: process.env.PORT
        }
    };
    bot = new TelegramBot(token, botOptions);

    //set web-hook
    bot.setWebHook(`${url}/bot${token}`);

    //Initialize express
    const express = require('express');
    const bodyParser = require('body-parser');

    //Start listening to port for catching web-hooks
    const app = express();
    app.use(bodyParser.json());
    app.post(`/bot${token}`, (req, res) => {
        bot.processUpdate(req.body);
        res.sendStatus(200);
    });
    app.listen(port, () => {
        console.log(`Express server is listening on ${port}`);
    });
}

bot.getMe().then(function(me)
		 {
		     console.log('Hello! My name is %s!', me.first_name);
		     console.log('My id is %s.', me.id);
		     console.log('And my username is @%s.', me.username);
		 });


// bot.onText(/^\/register/, function (msg, match){
//     let options = {
//         reply_markup: JSON.stringify({
//             one_time_keyboard: true,
//             keyboard: [
//                 [{text: "Предоставить номер телефона", request_contact: true}],
//                 [{text: 'Cancel'}]
//             ]
//         })
//     };
//
//     bot.sendMessage(msg.chat.id, "Пожлауйста отправьте Ваш номер телефона, нажав на кнопку", options)
//         .then(() => {
//             bot.on("contact", (msg) => {
//                 console.log(msg);
//                 bot.sendMessage(msg.chat.id,
//                     util.format("Итак, Вас зовут %s %s и Ваш номер телефона %s",
//                         msg.contact.first_name,
//                         msg.contact.last_name,
//                         msg.contact.phone_number));
//             });
//         });
//     console.log(msg);
// });

bot.on('text', function(msg) {
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
          bot.sendMessage(messageChatId, "ДЭИР СПб Бот приветствует тебя!\nНабери /help, чтобы узнать, что я могу!");
        break;
        case '/say':
	       sendMessageByBot(messageChatId, "Hello World");
        break;
        case '/showpaymentoptions':
        case 'Способы оплаты':
            options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Сбербанк', callback_data: "sber"},
                {text: 'Альфабанк', callback_data: "alpha"}],
                [{text: 'Безналичный расчёт', callback_data: "beznal"}]
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
        //Show informational menu
        case '/info':
          options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: "Расписание", url: scheduleURL}],
                [{text: "E-mail", callback_data: "spbEmail"}],
                [{text: "VK", url: linkVKClub}, {text: "Facebook", url: linkFBGroup}],
                [{text: "Регистрация на семинар", url: linkRegForSeminar}],
                [{text: "Книги", callback_data: "books"}]
              ]
            })
          };
          bot.sendMessage(messageChatId, "Располагаю следующей информацией:", options);
          break;
        /*case "/register":
          options = {
               reply_markup: JSON.stringify({
                   one_time_keyboard: true,
                   keyboard: [
                       [{text: "Предоставить номер телефона", request_contact: true}],
                       [{text: 'Cancel'}]
                   ]
               })
           };

           bot.sendMessage(messageChatId, "Пожлауйста отправьте Ваш номер телефона, нажав на кнопку", options)
               .then(() => {
                   let phone_num;
                   let user_name;
                   let user_lastname;

                   bot.once("contact", (msg) => {
                       console.log(msg);
                       phone_num = msg.contact.phone_number;
                       user_name = msg.contact.first_name;
                       user_lastname = msg.contact.last_name;
                       options = {
                         reply_force:true
                       };
                       bot.sendMessage(msg.chat.id, "Введите дату в формате мм.дд.гг и название семинара через пробел:", options)
                           .then(() => {
                                bot.once("text", (msg) => {
                                    options = {
                                        reply_force: true,
                                        reply_markup: {
                                            one_time_keyboard: true,
                                            inline_keyboard: [
                                                [{text: "Yes", callback_data: "regYes"}, {text: "No", callback_data: "regNo"}]
                                            ]
                                        }
                                    };
                                    let emailData = util.format("Данные заявки:\nФамилия: %s\nИмя: %s\nТелефон:%s\nДата и название семинара: %s",
                                                                user_lastname, user_name, phone_num, msg.text);
                                    console.log(emailData);

                                    bot.sendMessage(msg.chat.id, emailData + '\n' + 'Отправить?', options)
                                        .then(() => {
                                            bot.once("callback_query", (msg) => {
                                                const opts = {
                                                    chat_id: msg.chat.id,
                                                    message_id: msg.message_id
                                                };
                                                if (msg.data === "regYes") {
                                                    if (!emailSender.sendEmail(user_name + ' ' + user_lastname, emailData)){
                                                        bot.editMessageText("Отправлено, благодарю за регистрацию!\nАдминистратор свяжется с Вами в ближайшее время!", opts);
                                                    } else {
                                                        bot.editMessageText("Ошибка при отправки заявки", opts);
                                                    }
                                                } else {
                                                    bot.editMessageText("Отменено", opts);
                                                }
                                            });
                                        });
                                });
                           });
                   });
               });
           console.log(msg);
           break;*/
        case "Cancel":
               bot.sendMessage(messageChatId, "Отменено", {reply_markup:{remove_keyboard:true}});
          break;
	   default:
	       // sendMessageByBot(messageChatId, "I can't answer this :(");
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
          [{text: "Полный учебный курс 1-2 ступени (E-Book)", url:linkCourse12El}],
          [{text: "Полный учебный курс 3-4 ступени (E-Book)", url:linkCourse34El}],
          [{text: "Полный учебный курс по 1-2 ступени (Бумага)", url:linkCourse12Paper}],
          [{text: "Полный учебный курс по 3-4 ступени (Бумага)", url:linkCourse34Paper}]
        ]
      }),
      chat_id: msg.chat.id,
      message_id: msg.message_id
    };
    this.editMessageText("Ссылки на электронные и бумажные книги", keyboard);
  } else if (action === 'spbEmail') {
        this.editMessageText(spbEmail, opts);
  } else if (action === 'sber' || action === 'alpha' || action === "beznal") {
        this.editMessageText(showPaymentMethods(action), opts);
  }
});

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}

function showPaymentMethods(aPaymentMethod) {
      let pMethods = JSON.parse(fs.readFileSync(paymentMethodsFile));
      let pMethodsList = Object.keys(pMethods);

      if (pMethods[aPaymentMethod]) {
        return pMethods[aPaymentMethod];
      } else {
        return "Способ оплаты " + aPaymentMethod + " не найден";
      }
}

