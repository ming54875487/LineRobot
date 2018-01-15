// Ming Code
var linebot = require('linebot');
var express = require('express');
var HashMap = require('hashmap');

var bot = linebot({
  channelId: '1556930043',
  channelSecret: 'a1146f7d305139584775c11debe71f22',
  channelAccessToken: '7Ybbndokfdi1BCED2n6XfUH5bHMwj7pKgLEye/oN9weSBrIARBgp2fBT3dg1VHMQyt22HD6vTtT00HuFy+7LPNqh+/LCzpiMt8Z/8kHL846/eWVSPE3VGrIrKREjNC4V0G8Pgn5gveoxs9w6FFDcDgdB04t89/1O/w1cDnyilFU='
});

var timer, timer_g;
var pm = [];
var dataMap = new HashMap();
getPM25();

function getHelp() {
  var replyMsg = '1. 輸入PM2.5 [地點]可查詢當地PM2.5 2.其它功能還在開發中';
  return replyMsg;
}

//這一段的程式是專門處理當有人傳送文字訊息給LineBot時，我們的處理回應
bot.on('message', function(event) {
  console.log('message come in with:' + event.message.type);
    var msg = '';
    try {
      msg = getReplyMsg(event.message.text);
    } catch (e) {
      msg = e.message;
    }
    // 收到文字訊息時，直接把收到的訊息傳回去
    if (msg != null) {
      event.reply(msg).then(function(data) {
        // 傳送訊息成功時，可在此寫程式碼
        console.log(msg);
      }).catch(function(error) {
        // 傳送訊息失敗時，可在此寫程式碼
        console.log('錯誤產生，很恐怖，不要問：' + error);
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

function getReplyMsg(msg) {
  var replyMsg = '';
  try {
    //if(dataMap.get(msg) != null && dataMap.get(msg) != ''){
    //    replyMsg = dataMap.get(msg);
    //} else 
	if (msg.toUpperCase().indexOf('HELP') != -1) {
		replyMsg = getHelp();
    } else if (msg.toUpperCase().indexOf('PM2.5') != -1) {
      if (pm != null && pm.length > 0) {
        if (msg.indexOf('區域') != -1) {
          replyMsg = '你可以查詢的區域有: ';
          pm.forEach(function(e, i) {
            replyMsg += e[0] + ' ';
          });
        } else {
          pm.forEach(function(e, i) {
            if (msg.indexOf(e[0]) != -1) {
              replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
            }
          });
        }


      } else {
        replyMsg = '還沒撈到資料';
      }


      if (replyMsg == '') {
        replyMsg = '請輸入正確的地點';
      }
    } else if (msg.indexOf('早安') != -1 || msg.indexOf('晚安') != -1) {
		replyMsg = '老婆' + msg + '我愛你';
    } else {
		replyMsg = msg;
	}
  } catch (e) {
    replyMsg = e.message + '..' + e.name;
  }

  return replyMsg;
}

function getPM25() {
  clearTimeout(timer);
  console.log('開始撈pm2.5公開資料');
  require('jsdom/lib/old-api').env("", function(err, window) {
    if (err) {
      console.error(err);
      return;
    }

    var $ = require("jquery")(window);
    $.ajax({
      url: "http://opendata2.epa.gov.tw/AQX.json",
      type: 'GET'
    }).done(function(result) {
      pm = [];
      $.each(result, function(i) {
        pm[i] = [];
        pm[i][0] = this.SiteName;
        pm[i][1] = this['PM2.5'] * 1;
        pm[i][2] = this.PM10 * 1;
      });
      console.log('撈完pm2.5公開資料' + pm.length);
    }).fail(function() {
      debugger
    });
  });

  timer = setInterval(getPM25, 60 * 30); // 每半小時抓取一次新資料
}