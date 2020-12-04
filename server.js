var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
connections= [];

server.listen(process.env.PORT || 3000);
console.log('Server running...');

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
})


app.get('/mobile', function(req, res) {
  res.sendFile(__dirname + '/mobile.html');
})


app.get('/end', function(req, res) {
  res.sendFile(__dirname + '/end.html');
})

app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
    connections.push(socket);
    console.log(socket.id);

    //  var counter = io.sockets.clients(socket.room).length;

     socket.on('disconnect', function() {
       connections.splice(connections.indexOf(socket), 1);
       console.log('Disconnected: %s socket connected', connections.length);
     })

    socket.on('leave', function() {
      console.log("CLOSE NOW!");
      setTimeout(function() {
        io.sockets.emit('backHome');
      }, 1500)
    });

    socket.on('showJam', function() {
      console.log("JAM GET HIT");
      io.sockets.emit('passDesk');
    })

   socket.on('moveLeftRight', function(lrData, fbData) {
      io.sockets.emit('desktopMoveLR', lrData, fbData);
   })

})
