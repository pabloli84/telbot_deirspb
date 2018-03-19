var TelegramBot = require('node-telegram-bot-api');
var config = require('./config.json');
var token = '536637011:AAHLIoMD0tiA_CM7s9XgUocSS3UWKrKiLrM';
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
	      case '/payment_methods':
	       sendMessageByBot(messageChatId, showPaymentMethods(messageText[1]));
	             break;
	   default:
	       sendMessageByBot(messageChatId, "I can't answer this :(");
	             break;
	   }

	   console.log(msg);
       });

function sendMessageByBot(aChatId, aMessage)
{
    bot.sendMessage(aChatId, aMessage, { caption: 'I\'m a cute bot!' });
}

function showPaymentMethods(aPaymentMethod) {
      var pMethods = JSON.parse(fs.readFileSync(paymentMethodsFile));
      var pMethodsList = Object.keys(pMethods);

      if (pMethods[aPaymentMethod] === '') {
        return "Доступны следующие методы оплаты:" + pMethodsList + '\n' + "Например, /payment_methods sber";
      } else {
        return pMethods[aPaymentMethod];
      }
}
