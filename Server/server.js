var web_socket_svr = require('ws').Server;
var wss = new web_socket_svr({port:3000});
wss.on('connection',function(ws){
    console.log('client connected');
    ws.on('message',function(msg){
        console.log('user_login:'+msg);
    })
})
