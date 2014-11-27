var express = require("express"),
	app= express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server);

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
    //"send-mesage" and "new message" are the functions on index and works everywhere
    socket.on("send-message" , function(data){
    	io.sockets.emit('new-message',data);
    });


});