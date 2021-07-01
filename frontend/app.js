var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
//var stats = require('./routes/stats');

const app = express();
const zmq = require('zeromq'), client = zmq.socket('sub');
// const stats = require('./routes/stats');



const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.set('srv', server);

//Sub on ZMQ sock
client.bindSync('tcp://*:6080');
console.log('Subscribed bound to port 6080');


client.on('error', function (err) {
  console.log('Error ' + err)
})

// Subsribe on the latency channel
client.subscribe('');

// Connection counter (5 sec resolution)
var counters = [];
var counter = 0;
var tick = 0;

// Send stats to map page every 5 seconds
setInterval(function() {
  counters.push(counter);
  counter = 0;
  if (counters.length == 12) {
    counters.shift();
  }
  var sum = counters.reduce(function(a, b) { return a + b; }, 0);
  io.emit('counter', {sum: sum});
  // io.emit('mapstats', stats.getTop5Stats());
}, 5000)


var previous_source_long;
var previous_destination_long;

function sendRandomData(m) {
  io.emit('randomdata', {
    source_country: m['source_country'],
    source_countrycode: m['source_countrycode'],
    source_city: m['source_city'],
    destination_country: m['destination_country'],
    destination_countrycode: m['destination_countrycode'],
    destination_city: m['destination_city'],
    latency_total: m['latency_total']
  });
}

var lastTime = 0
// This is the  subscriber part
console.log("Start to listen...")
client.on('message', function(message){
  //console.log("some message received on ZMQ:"+message)
  var m = JSON.parse(message);
  //console.log("Message: " + m['destination_lat']);

  var source_location_string = m['source_city'] + ' (' + m['source_country'] +')';
  var destination_location_string = m['destination_city'] + ' (' + m['destination_country'] +')';

  // Drop records that we did not get geolocation for
  if (m['source_country'] == '-' || m['destination_country'] == '-') return;

  // Filter out repeated measurements from display
  if (m['source_long'] != previous_source_long || m['destination_long'] != previous_destination_long){

    // Send measurement for the map
    io.emit('latency', {
      destination_lat: m['destination_lat'],
      destination_long: m['destination_long'],
      destination_country: m['destination_country'],
      destination_city: m['destination_city'],
      destination_proxy_type: m['destination_proxy_type'],
      destination_as: m['destination_as'],
      destination_asn: m['destination_asn'],
      source_lat: m['source_lat'],
      source_long: m['source_long'],
      source_country: m['source_country'],
      source_city: m['source_city'],
      source_proxy_type: m['source_proxy_type'],
      source_as: m['source_as'],
      source_asn: m['source_asn'],
      latency: m['latency_total']
    });

    // If more than 5 seconds passed, we catch one measurement and send it to the random data
    var timeDiff = (new Date() - lastTime)/1000;
    if (lastTime == 0 || (Math.round(timeDiff%60) > 5)){
      sendRandomData(m);
      lastTime = new Date();
    }
    previous_source_long = m['source_long'];
    previous_destination_long = m['destination_long'];
  }

  counter++;
});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
//app.use('/stats', stats.router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
