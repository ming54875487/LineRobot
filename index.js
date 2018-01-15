var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: '1556930043',
  channelSecret: 'a1146f7d305139584775c11debe71f22',
  channelAccessToken: '7Ybbndokfdi1BCED2n6XfUH5bHMwj7pKgLEye/oN9weSBrIARBgp2fBT3dg1VHMQyt22HD6vTtT00HuFy+7LPNqh+/LCzpiMt8Z/8kHL846/eWVSPE3VGrIrKREjNC4V0G8Pgn5gveoxs9w6FFDcDgdB04t89/1O/w1cDnyilFU='
});

//這一段的程式是專門處理當有人傳送文字訊息給LineBot時，我們的處理回應
bot.on('message', function(event) {
  console.log('message come in with:' + event.message.type);
  if (event.message.type = 'text') {
    var msg = event.message.text;
  //收到文字訊息時，直接把收到的訊息傳回去
    event.reply(msg).then(function(data) {
      // 傳送訊息成功時，可在此寫程式碼 
      console.log(msg);
    }).catch(function(error) {
      // 傳送訊息失敗時，可在此寫程式碼 
      console.log('錯誤產生，錯誤碼：'+error);
    });
  }
  console.log('message process end');
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log('目前的port是', port);
});