var TelegramBot = require('node-telegram-bot-api');
var config = require('./config.json');
var botOptions = {
    polling: true
};

var fs = require('fs');

var content = fs.readFileSync('./config.json')
var config = JSON.parse(content);
var token = config.ApiToken;
var paymentMethodsFile = "./paymentMethods.json";

var bot = new TelegramBot(token, botOptions);

bot.getMe().then(function(me)
		 {
		     console.log('Hello! My name is %s!', me.first_name);
		     console.log('My id is %s.', me.id);
		     console.log('And my username is @%s.', me.username);
		 });

bot.on('text', function(msg)
       {
	   var messageChatId = msg.chat.id;
	   var messageText = msg.text.split(" ");
	   var messageDate = msg.date;
	   var messageUsr = msg.from.username;
//	   var messageCmd = msg.text.split(" ");

	   switch (String(messageText[0])) {
	      case '/say':
	       sendMessageByBot(messageChatId, "Hello World");
               break;
	      case '/showpaymentoptions':
	       //sendMessageByBot(messageChatId, showPaymentMethods(messageText[1]));

/*        var opts = {
            //reply_to_message_id: msg.message_id,
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{text:'Сбербанк', callbak_data:'1'}],
                    [{text:'Альфа Банк', callbak_data:'2'}],
                    [{text:'Безнал', callbak_data:'3'}]
                ]
            })
          };
            sendMessageByBot(messageChatId, "Выберете способ оплаты:", opts);*/
          var options = {
            reply_markup: JSON.stringify({
              inline_keyboard: [
                [{text: 'Сбербанк', callback_data: "sber"}],
                [{text: 'Альфабанк', callback_data: "alpha"}],
                [{text: 'Безнал', callback_data: "beznal"}]
              ]
            })
          };
          bot.sendMessage(messageChatId, "Выберете способ оплаты:", options);

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
  let text;
  bot.editMessageText(showPaymentMethods(action), opts);
});

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}

function showPaymentMethods(aPaymentMethod) {
      var pMethods = JSON.parse(fs.readFileSync(paymentMethodsFile));
      var pMethodsList = Object.keys(pMethods);

      //console.log("Выбранный метод оплаты: " + aPaymentMethod);
      //if (aPaymentMethod === null) return "Укажите один из доступных методов оплаты: " + pMethodsList;

      if (pMethods[aPaymentMethod]) {
        return pMethods[aPaymentMethod];
      } else {
        return "Доступны следующие методы оплаты: " + pMethodsList + '\n' + "Например, /payment_methods sber";
      }
}
