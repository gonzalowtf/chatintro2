var express = require("express"),
	app= express(),
	server = require("http").createServer(app),
	io = require("socket.io").listen(server),
	users = {};

// server where the app will be listening

server.listen(3000);

console.log("server listening at port 3000 or oneline port");

//server will run on this way
app.get('/', function(req, res){

    console.log(req.url);
    res.sendFile(__dirname + '/index.html');

});

//for get data into server

// when the connection is ready everywhere here appears this
io.sockets.on("connection",function(socket){

// for the online users ta the moment od connection
	socket.on("new-user",function(data, callback){

       if(data in users){
       	callback(false);
       }
       else{
       	callback(true);
       	socket.nickname=data;
        users[socket.nickname] = socket;
       	//nicknames.push(socket.nickname);
       	updatenicknames();
       }

	});
    //"send-mesage" and "new message" are the functions on index and works everywhere
    socket.on("send-message" , function(data,callback){
      var msg = data.trim(); //this take care of a posible space at the beggining
      if(msg.substr(0,3) === '/w '){         // (0,3) first three characters of the word

                msg= msg.substr(3);
                var ind = msg.indexOf(" ");
                if(ind != -1){
                  var name = msg.substring(0,ind);
                  var msg = msg.substring(ind + 1);
                  if(name in users){
                    users[name].emit('whisper',{msg:msg , nick : socket.nickname});

                 console.log("whisper");
               }else{
                    callback("Error : enter valid user");
               }
               }else{

                callback("Error , please enter a messege for your whisper");

               }


      }else{
    	io.sockets.emit('new-message',{msg:msg , nick : socket.nickname});
    }
    });

function updatenicknames(){
	       	io.sockets.emit("usernames",Object.keys(users));


}

  socket.on("disconnect" , function(data){

  			if(!socket.nickname) return;
        delete users[socket.nickname];
  			updatenicknames();
  });
});