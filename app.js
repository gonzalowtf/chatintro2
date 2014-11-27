var express = require("express"),
	app= express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	nicknames = [];

// server where the app will be listening

server.listen(3000);

console.log("server listening at port 3000 or oneline port");

//server will run on this way
app.get('/', function(req, res){

    res.sendFile(__dirname + '/index.html');

});

//for get data into server

// when the connection is ready everywhere here appears this
io.sockets.on("connection",function(socket){

// for the online users ta the moment od connection
	socket.on("new-user",function(data, callback){

       if(nicknames.indexOf(data) != -1){
       	callback(false);
       }
       else{
       	callback(true);
       	socket.nickname=data;
       	nicknames.push(socket.nickname);
       	updatenicknames();
       }

	});
    //"send-mesage" and "new message" are the functions on index and works everywhere
    socket.on("send-message" , function(data){
    	io.sockets.emit('new-message',{msg:data , nick : socket.nickname});
    });

function updatenicknames(){
	       	io.sockets.emit("usernames",nicknames);


}

  socket.on("disconnect" , function(data){

  			if(!socket.nickname) return;
  			nicknames.splice(nicknames.indexOf(socket.nickname),1);
  			updatenicknames();
  });
});