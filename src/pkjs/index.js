// PebbleKit JS (pkjs)
Pebble.on('message', function(event) {
  // Get the message that was passed
  var message = event.data;

  if (message.fetch) {
    var url = 'https://poloniex.com/public?command=returnTicker';
    request(url, 'GET', function(respText) {
      var json = JSON.parse(respText);
      Pebble.postMessage({
        'currency': {
          'USDT_BTC':{
            'LAST': json.USDT_BTC.last,
            'Change': json.USDT_BTC.percentChange,
            'Volume': json.USDT_BTC.baseVolume},
          'USDT_BCH': {
            'LAST': json.USDT_BCH.last,
            'Change': json.USDT_BCH.percentChange,
            'Volume': json.USDT_BCH.baseVolume},
          'USDT_XMR': {
            'LAST': json.USDT_XMR.last,
            'Change': json.USDT_XMR.percentChange,
            'Volume': json.USDT_XMR.baseVolume},
          'USDT_LTC': {
            'LAST': json.USDT_LTC.last,
            'Change': json.USDT_LTC.percentChange,
            'Volume': json.USDT_LTC.baseVolume}
        }
      });
    });
    url = 'https://query.yahooapis.com/v1/public/yql?q=';
		url+= 'select%20*%20from%20yahoo.finance.xchange%20where%20pair%20in%20(%22USDJPY,BTCUSD,EURJPY%22)';
		url+= '&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    request(url, 'GET', function(respText) {
      var json = JSON.parse(respText);
//			console.log(json.query.results.rate[0].Rate);
      Pebble.postMessage({
        'YahooCCY': {
          'USD_JPY':{
            'LAST': json.query.results.rate[0].Rate},
          'BTC_USD':{
            'LAST': json.query.results.rate[1].Rate},
        }
      });
    });
  }
});

function request(url, type, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function (e) {
    // HTTP 4xx-5xx are errors:
    if (xhr.status >= 400 && xhr.status < 600) {
      console.error('Request failed with HTTP status ' + xhr.status + ', body: ' + this.responseText);
      return;
    }
    callback(this.responseText);
  };
  xhr.open(type, url);
  xhr.send();
}