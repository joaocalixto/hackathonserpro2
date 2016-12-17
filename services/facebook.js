var request = require('request');

function getData(callback) {
  var token = 'EAACEdEose0cBALk6IpniLOQe6zxhdPPzX7kBCB5Pzr0dTQKpCPnJdb34MS2u5hPXSWd7d0VokXcf5ZB4QkM99Oyv2hXY043ioBbrZCvr84ComZB2V9sH8R4ZATdVwuOg41GfVYtDrtVAKawWxgZClahtqdbJz8vF9hbUZBSpQ0ZAQZDZD';
  request('https://graph.facebook.com/677398892416799?fields=posts{likes{pic,id,name,username,link}}&access_token='+token,
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = [];

        var bodyObj = JSON.parse(body);
        console.log('BODY ' + bodyObj.posts.data[0].likes.data[0].name);
        var likes = bodyObj.posts.data[0].likes.data;

        for (var i = 0; i < likes.length; i++) {
          console.log('LIKE ' + JSON.stringify(likes[i]));
          result.push(likes[i]);
        }
        console.log('RESULT ' + JSON.stringify(result));
      }
      callback(JSON.stringify(result));
  });
}

function sendData() {

  getData(function(data){
    var dataRequest = '{"data"'+":"+data+'}';
    console.log('POST DATA ' + dataRequest);
    request.post({
      headers: {'content-type': 'application/json'},
      url: 'https://shrouded-scrubland-86454.herokuapp.com/user-test',
      body: dataRequest,
    }, function(error, response, body){
      var arrayStr = JSON.parse(body);
      var ids = JSON.parse(arrayStr).ids;

      setTimeout(function () {
        ids.forEach(function(item) {
          sendFromBot(item);
        });
      }, 2000);
    });
  })

};

function sendFromBot(senderId) {
  var dataRequest = {
  	"object": "page",
  	"entry": [{
  		"id": "677398892416799",
  		"time": 1475160913537,
  		"messaging": [{
  			"sender": {
  				"id": senderId.toString()
  			},
  			"recipient": {
  				"id": "677398892416799"
  			},
  			"timestamp": 1475160913516,
  			"message": {
  				"mid": "mid.1475160913507:14757684d3f3db0a63",
  				"seq": 939,
  				"text": "oi"
  			}
  		}]
  	}]
  }
  request.post({
    headers: {'content-type': 'application/json'},
    url: 'https://shrouded-scrubland-86454.herokuapp.com/webhook',
    body: JSON.stringify(dataRequest),
  }, function(error, response, body){
    console.log(body);
  });
}

sendData();
