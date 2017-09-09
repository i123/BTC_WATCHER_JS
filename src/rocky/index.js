
// Rocky.js
var rocky = require('rocky');

// Global object to store weather data
var currency;
var yahooccy;

/*
rocky.on('hourchange', function(event) {
  // Send a message to fetch the weather information (on startup and every hour)
  rocky.postMessage({'fetch': true});
});
*/

rocky.on('minutechange', function(event) {
  // Tick every minute
   // Current date/time
  var d = new Date();
  if (currency) {
    if(d.getMinutes()%2==0){
      rocky.postMessage({'fetch': true});
    }
  }else{
    rocky.postMessage({'fetch': true});
  }

  rocky.requestDraw();
});

rocky.on('message', function(event) {
  // Receive a message from the mobile device (pkjs)
  var message = event.data;

  if (message.currency) {
    // Save the weather data
    currency = message.currency;
    
    // Request a redraw so we see the information
    rocky.requestDraw();
  }

  if (message.YahooCCY) {
    // Save the weather data
    yahooccy = message.YahooCCY;
    
    // Request a redraw so we see the information
    rocky.requestDraw();
  }
});

rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;
  var ccy = 0;
  // Clear the screen
  ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Draw the conditions (before clock hands, so it's drawn underneath them)
  if (currency) {
    drawCurrency(ctx, currency);
		console.log('currency; ' + currency.USDT_BTC.LAST);
  }
	if (yahooccy) {
    drawYahooCCY(ctx, yahooccy);
		console.log('yahooccy; ' + yahooccy.BTC_USD.LAST);
  }
	if (currency || yahooccy) {
		console.log('polo- yahoo');
		ccy =  parseFloat(currency.USDT_BTC.LAST)- parseFloat(yahooccy.BTC_USD.LAST) ;
 		ccy = ccy/parseFloat(yahooccy.BTC_USD.LAST)*100;
		console.log('ccy; ' + ccy);
	  ccy = floatFormat(ccy,2);
  	ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.font = '14px Gothic'; //24 ,18 
		ctx.fillText(' ' + ccy +'%',0,154);

	}
	
  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Current date/time
  var d = new Date();

  // Set the text color
  ctx.fillStyle = 'white';

  // Set the text font 
  ctx.font= '42px Bitham-numeric';
  
  // Center align the text
  ctx.textAlign = 'center';
  
	var dateString = zeroFill(d.getHours(), 2);
	dateString += ':' + zeroFill(d.getMinutes(), 2);
  // Display the time, in the middle of the screen
  ctx.fillText(dateString, w / 2, h / 2-50, w);
  
    // Set the text color
  ctx.fillStyle = 'screaminGreen';
    // Set the text font 
  ctx.font= '28px Gothic';
  
  // Center align the text
  ctx.textAlign = 'left';
  
  var weekday = new Array(7);
  weekday[0] = "SUN";
  weekday[1] = "MON";
  weekday[2] = "TUE";
  weekday[3] = "WED";
  weekday[4] = "THU";
  weekday[5] = "FRI";
  weekday[6] = "SAT";

  dateString = d.toLocaleDateString(undefined, {month: '2-digit'});
  dateString += '/' + d.toLocaleDateString(undefined, {day: '2-digit'});
  dateString += ' ' + weekday[d.getDay()] ;
 
  ctx.fillText(dateString, 0, 0, w);
  
});

function floatFormat(number, n) {
  var _number = parseFloat(number);
  var _pow = Math.pow(10, n);
  return (Math.round(_number * _pow) / _pow).toFixed(n);
}

function volFormat(number){
  var _number = parseInt(number);
  if(_number>=1000*1000){
    _number=floatFormat(_number/(1000*1000),1);
    _number= _number + 'M';
  }else if(_number>=1000){
    _number=floatFormat(_number/(1000),1);
    _number= _number + 'K';
  }else{
    _number=floatFormat(_number/(1),1);
    _number=  String(_number) ;
  }
  return _number;
}

function drawCurrency(ctx, Currency) {
  // Draw the text, top center
  ctx.fillStyle = 'white';
  ctx.textAlign = 'right';
  ctx.font = '28px Gothic'; //24 ,18 

  // ctx.fillText('' + floatFormat(Currency.USDT_LTC.LAST, 2) , 142,78);
  // ctx.fillText('' + floatFormat(Currency.USDT_XMR.LAST, 2) , 142,98);
  // ctx.fillText('' + floatFormat(Currency.USDT_BCH.LAST, 2) , 142,118);
  ctx.fillText('' + floatFormat(Currency.USDT_BTC.LAST, 2) , 142,138);

  ctx.fillStyle = '#00AA55';
  ctx.textAlign = 'left';
  ctx.font = '14px Gothic';
  // ctx.fillText('LTC, ' + volFormat(Currency.USDT_LTC.Volume), 0,83);
  // ctx.fillText('XMR, ' + volFormat(Currency.USDT_XMR.Volume), 0,103);
  // ctx.fillText('BCH, ' + volFormat(Currency.USDT_BCH.Volume), 0,123);
  ctx.fillText('USDT, ' + volFormat(Currency.USDT_BTC.Volume), 0,143);
}

function drawYahooCCY(ctx, Currency) {
  // Draw the text, top center
  ctx.fillStyle = 'white';
  ctx.textAlign = 'right';
  ctx.font = '28px Gothic';

  ctx.fillText('' + floatFormat(Currency.USD_JPY.LAST, 2) , 142,98);
  ctx.fillText('' + floatFormat(Currency.BTC_USD.LAST, 2) , 142,118);

  ctx.fillStyle = '#FF0000';
  ctx.textAlign = 'left';
  ctx.font = '14px Gothic';
  ctx.fillText('USDJPY ', 0, 103);
  ctx.fillText('USD ', 0, 123);
}
function zeroFill(num, fill) {
  var padd = "0000000000";
  return (padd + num).slice(-fill);
}