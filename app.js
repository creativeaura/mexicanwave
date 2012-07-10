
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , _ = require('underscore')._;
var app = module.exports = express.createServer(express.logger());

var io = require('socket.io').listen(app);

var port = process.env.PORT || 3000;

var clients = [];

// Configuration

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 2);
});


app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/remote', routes.remote);

app.listen(port, function(){
  console.log("Express server listening on port %d in %s mode", port, app.settings.env);
});

// Listening to new connections.
io.sockets.on('connection', function(socket) {
  // Listtening for new screen to be attached
  socket.on('newscreen', function(data){
    // Add screen to clients array
    clients.push(socket);
    console.log('New Screen request');
    console.log('Total Screens attached %d', clients.length);
    //Send screen a confirm message.
    socket.emit('s2c', {message: 'Connected'});
  });
  
  //broadcast the stats for no. of connected screens.
  io.sockets.emit('stats', {total: clients.length});

  // Listening for start wave command from remote
  socket.on('start', function(data){
    var i = 1;
    _.each(clients, function(client) {
      setTimeout(function(){
        sendWaveCommand(client);
      }, 2000 + i);
      i += 300;
    });
  });

  socket.on('restart', function(data){
    _.each(clients, function(client) {
      client.emit('wave', {command: 'reset', color:'white'});
    });
    clients = null;
    clients = [];
    io.sockets.emit('stats', {total: clients.length});
  });
});

function sendWaveCommand(client) {
  client.emit('wave', {command: 'go-go-go', color:'red'});
}