var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Routing
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/temp', function(req, res){
  res.sendFile(__dirname + '/temp.html');
})

app.get('/new', function(req, res){
  res.sendFile(__dirname + '/index1.html');
})

http.listen(8000, function(){
  console.log('listening on port 8000');
});

var usersList = [];
var users = {};

io.on('connection', function (socket){

  var addedUser = false;
  var user = '';

  socket.on('chat message', function (data){
    var tosocketid = users[data.to.trim()];
    var fromscoketid = users[data.from.trim()];
    //io.emit('chat message', {
    socket.broadcast.to(tosocketid).emit('chat message', {
      message: data.mssg,
      name: data.from,
      to: data.to,
      id: tosocketid
    });
  });

  //when new users is added
  socket.on('add user', function (username) {
    usersList.push(username);
    socket.users = usersList;
    users[username] = socket.id;
    addedUser = true;
    user = username;

    socket.emit('login', socket.users);

    //broadcast that a person has connected
    socket.broadcast.emit('user joined', socket.users);
  });

  //when new user left
  socket.on('disconnect', function () {
    if (addedUser) {
      usersList.splice(usersList.indexOf(user),1);

      //broadcast that a person has left
      socket.broadcast.emit('user left', socket.users);
    }
  });


});

