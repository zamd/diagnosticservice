'use strict';
const WebSockerServer = require('ws').Server,
app = require('express')(),
http = require('http');

const _ = require('lodash');

const Commands = {
    'runDiagnostic':  function(){
        var cmd = {command: 'runDiagnostic', payload: {}};
        return JSON.stringify(cmd);
    }
};

app.post('/diagnose', (req,res)=>{
    getClient({}, client=>{
        client.send(Commands['runDiagnostic'](), err=>{
            console.log(`error ${err}`);
        });
    });
    res.end();
});


function getClient(options, done){
    done(wss.clients[0]);
}

var server = http.createServer(app);
server.listen(8080, ()=>console.log('listening'));

const wss = new WebSockerServer({server: server});

wss.on('connection',socket=>{
    socket
    .on('message',handleMessage)
    .on('close',clean)
    .on('err',handleError)
});

function send(response, socket){
    var msg = JSON.stringify(response);
    socket.send(msg);
}
function handleMessage(payload){
    var client = this;
    var msg = JSON.parse(payload);
    switch(msg.type){
        case 2:
            send({ok: true},client);
            break;
        default:
            send({ok: false},client);
    }
}

function clean(){
    console.log('closed');
}

function handleError(err){

}