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