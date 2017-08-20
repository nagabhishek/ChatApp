$(function() {
 
  var socket = io();
 
  var $usernameInput = $('.username'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  var username;
  var selectUser;
  var id = 0;
  $usernameInput.focus();

  //loading popup login page
  loadPopupBox();

  var sockets = {};

  function unloadPopupBox() { 
    $('.active-list').show();
    $('.active-container').show();
    $('#login-page').hide();
    $usernameInput.val('');
    $("#active-user-name").html(username);
  }    
  
  function loadPopupBox() {
      $('#login-page').show(); 
      $('.active-list').hide(); 
      $('.chat-box').hide(); 
      $('.active-container').hide();
      $usernameInput.focus(); 
  }   

  function loadChatWindow(user) {
    $('.chat-box').show();
    $('#m').focus();
    selectUser = user;
    console.log("selectUser",selectUser);
  }     

  //Function to send message
  function sendMessage(){
    var text = $('#m').val().trim();
    if(text.length == 0) {
      alert('Cannot send empty messages');
    } else {
      scrollAuto();
      console.log('selectUser',selectUser);
      socket.emit('chat message', {
        mssg: text,
        to: selectUser,
        from: username
      });
      $('#messages').append('<li class="self"><span class="name"></span><span>'+text+'</span></li>');
      $('#m').val('');
      event.preventDefault();
    }
  }

  //scroll to bottom of the text area
  function scrollAuto(){
    var textarea = $('#messages');
    textarea.animate({"scrollTop": $('#messages')[0].scrollHeight}, "fast");
  }

  $("#users").on("click", "li", function() {
    var user = $(this).find('a').text()
    loadChatWindow(user);
  });

  //Sets the username
  function setUsername () {
    username = $usernameInput.val().trim();

    if (username) {
      socket.emit('add user', username);
      unloadPopupBox();
    } else {
      alert('Name cannot be blank');
    }
  }

  //sending chat messages
  socket.on('chat message', function(data){
    console.log("msg",data);
    if(data.id != socket.id){
      $(".chat-box").fadeIn('fast');
    }
    if(data.name == username){
      $('#messages').append('<li class="self"><span class="name"></span><span>'+data.message+'</span></li>');
    } else {
      $('#messages').append('<li class="other"><span class="name"></span><span>'+data.message+'</span></li>');
    }
    scrollAuto();
  });

  //when user login
  socket.on('login', function(data){
    console.log(data);
    $('#users').empty();
    for (var i = 0; i < data.length; i++) {
      if(!(data[i] === username)){
        $('#users').append('<li><span class="active"></span><a>&nbsp;' + data[i] + '</a></li>');
      }
    };
  });

  //when some user joins
  socket.on('user joined', function (data) {
    $('#users').empty();
    for (var i = 0; i < data.length; i++) {
      if(!(data[i] === username)){
        $('#users').append('<li><span class="active"></span><a>&nbsp;' + data[i] + '</a></li>');
      }
    };
  });

  //when some user lefts
  socket.on('user left', function (data) {
    $('#users').empty();
    for (var i = 0; i < data.length; i++) {
      if(!(data[i] === username)){
        $('#users').append('<li><span class="active"></span><a>&nbsp;' + data[i] + '</a></li>');
      }
    };
  });

  $(window).keydown(function (event) {
    if (event.which === 13) 
    {
      if (username) {
        sendMessage();
      } else {
        setUsername();
      }
    }
  });

});