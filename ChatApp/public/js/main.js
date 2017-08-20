$(function() {
 
  var socket = io();
 
  var $usernameInput = $('.username'); // Input for username
  var $messages = $('.messages'); // Messages area
  var $inputMessage = $('.inputMessage'); // Input message input box

  // Prompt for setting a username
  var username;
  var selectUser;
  var id = 0;
  $usernameInput.focus();


  $("#messages").change(function() {
    console.log("inside change function");
    var textarea = document.getElementById('m');
    textarea.scrollTop = textarea.scrollHeight;
  });

  $('#popup_box').css({
    "opacity":0
  });

  $('#popupBoxClose').click( function() {            
      unloadPopupBox();
  });

  function unloadPopupBox() { 
      $('#popup_box').fadeOut("fast");
  }    
  
  function loadPopupBox() {
      $('#popup_box').fadeIn("fast");
      $("#popup_box").css({
          "opacity": "1"  
      });         
  }        

  function sendMessage(){
    
  }

  // Sets the username
  function setUsername () {
    username = $usernameInput.val().trim();

    if (username) {
      $('.login.page').fadeOut();
      $('.private').fadeOut();
      socket.emit('add user', username);
    } else {
      alert('Name cannot be blank');
    }
  }

  //getting the message
  $('form').submit(function(){
    var text = $('#m').val().trim();
    if(text.length == 0){
      alert('Cannot send empty messages');
    } else {
      socket.emit('chat message', $('#m').val());
    }
    $('#m').val('');
    return false;
  });

  //sending chat messages
  socket.on('chat message', function(msg){
    $('#messages').append('<li><span class="chat-name">'+msg.name+':</span>&nbsp;'+msg.message+'</li>');
  });

  //when user login
  socket.on('login', function(data){
    console.log(data);
    $('#users').empty();
    for (var i = 0; i < data.length; i++) {
      if(!(data[i] === username)){
        $('#users').append($('<li>').text(data[i]));
      }
    };
  });

  //when some user joins
  socket.on('user joined', function (data) {
    $('#users').empty();
    for (var i = 0; i < data.length; i++) {
      if(!(data[i] === username)){
        $('#users').append($('<li>').text(data[i]));
      }
    };
  });

  //when some user lefts
  socket.on('user left', function (data) {
    $('#users').empty();
    for (var i = 0; i < data.length; i++) {
      if(!(data[i] === username)){
        $('#users').append($('<li>').text(data[i]));
      }
    };
  });

  //start private chat
  $("#users").on("click", "li", function() { 
      var to = $(this)[0].innerHTML;
      var from = username;
      id++;

      //popup for sending private chat
      loadPopupBox();
      socket.emit('subscribe', {
        id : id,
        from: from,
        to: to
      });
  });

  //sending private chat message
  $('#chat-form').submit(function() {
    socket.emit('send message', {
      room: id,
      message: $('#chat-txt').val(),
      user: username
    });
    $('#chat-txt').val('');
    return false;
  });

  //on private chat receive
  socket.on('send message', function (chatMsg){
    $('#chat-mssg').append('<li><span class="chat-name">'+msg.user+':</span>&nbsp;'+chatMsg.message+'</li>');
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