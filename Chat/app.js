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

http.listen(4000, function(){
  console.log('listening on port 4000');
});

var usersList = [];
var chatRoom = [];

io.on('connection', function (socket){

  var addedUser = false;
  var user = '';

  socket.on('chat message', function (msg){
    io.emit('chat message', {
      message:msg,
      name:user
    });
  });

  //when new users is added
  socket.on('add user', function (username) {
    usersList.push(username);
    socket.users = usersList;
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

  //subscribe to group
  socket.on('subscribe', function (data) {
    chatRoom.push(data);
    socket.rooms = chatRoom;
    socket.join(data.id);
  });

  //sending message to private chat room
  socket.on('send message', function (data) {
    socket.broadcast.to(data.room).emit('private post', {
      user: data.user,
      mssg: data.message
    });
  });

});

