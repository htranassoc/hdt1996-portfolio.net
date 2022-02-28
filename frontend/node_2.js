const express = require("express"); 
const fs = require("fs");
const path = require("path");
const {ExpressPeerServer} = require("peer");
const wsServer = require('websocket').server;
let debug = require('./node_config.js').debug

const node_server = express();
const PORT = 8011, peerPORT = 8021, wsPORT = 8031
let http,phttp,wshttp


node_server.set("view engine",'ejs');

////////////////////////////////////// HTTP/S Servers //////////////////////////////////////////////////////////////

if(debug === false){
  http = require('https').Server(
  {
    key: fs.readFileSync(path.join('C:/Projects/Portfolio/webserver/proxy/certs/','key_p1.pem')),
    cert: fs.readFileSync(path.join('C:/Projects/Portfolio/webserver/proxy/certs/','cert_p1.pem'))
  },node_server)

  phttp = require('https').Server(
    {
      key: fs.readFileSync(path.join('C:/Projects/Portfolio/webserver/proxy/certs/','key_p1.pem')),
      cert: fs.readFileSync(path.join('C:/Projects/Portfolio/webserver/proxy/certs/','cert_p1.pem'))
    },node_server)
  
  
  wshttp = require('https').Server(
    {
      key: fs.readFileSync(path.join('C:/Projects/Portfolio/webserver/proxy/certs/','key_p1.pem')),
      cert: fs.readFileSync(path.join('C:/Projects/Portfolio/webserver/proxy/certs/','cert_p1.pem'))
    },node_server)}

else
{
  http = require('http').Server(node_server)
  phttp = require('http').Server(node_server)
  wshttp = require('http').Server(node_server)
}



///////////////////////////////////////// Socket.IO Server /////////////////////////////////////////////////////////////

const io = require('socket.io')(http,
  {
    maxHttpBufferSize: 1e8,
    cors:true,
    transports:['websocket','polling'] ,
    pingTimeout:60000,
    pingInterval:30000,
    cors: {
      origin: [],
      credentials: true,
      methods: ["GET", "POST"]},
  })
  

/////////////////////////////////////////// PeerJS Server /////////////////////////////////////////////////////////

  
  const peerServer = ExpressPeerServer(phttp, 
    {
      credentials: true,debug: true,
      cors: {
      origin: ['https://hdt1996-portfolio.me','http://localhost:3000','http://192.168.7.237'],
      credentials: true,
      methods: ["GET", "POST"]},
    })
  node_server.use("/peerjs",peerServer);

//////////////////////////////////////////// Native Websocket Server ////////////////////////////////////////////////

const ws = new wsServer({
  httpServer: wshttp
});


//////////////////////////////////////////////// Global Vars/Functions //////////////////////////////////////////

var current_users = {};
let ping_client = async() => {
  await new Promise(resolve => {
    setTimeout(resolve,15000)
    io.sockets.emit('ping_client', `Ping from Server ${PORT}`);
  });
  setTimeout(ping_client,0)
}
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};
const wsclients = {};

////////////////////////////////////////////////////// Native Websocket Events //////////////////////////////////////////////////////

ws.on('request', function (req) {
  var userID = getUniqueID();
  console.log(`${new Date} | Connection from origin: ${req.origin}`);

  const connection = req.accept(null, req.origin);
  wsclients[userID] = connection;
  connection.on('message', function(message) {
    data=JSON.parse(message.utf8Data)
    
    if (message.type === 'utf8') {
      if (data.type==='req_userID')
        {
          wsclients[userID].sendUTF(JSON.stringify({req_userID:userID}))
        }
      else
        {
        for(key in wsclients) 
          {
          wsclients[key].sendUTF(message.utf8Data);
          }
        }
    }
  })
}); 

//////////////////////////////////////////////////// Socket.IO General Events //////////////////////////////////////////////////////

ping_client()
io.on("connection", async function(socket)

{
  console.log('Connected to Socket')
  
  socket.on('pong', function(data){
    console.log('pong')
  });

  socket.on("checkID",function(data)
    {
      if(data.userID === undefined || data.userID === null){socket.disconnect();console.log('Disconnected')}
      socket.join(data.userID)
    });

  socket.on('client_file_share',async function(data) 
    {
      io.to(data.senderID).emit('response','Client Confirm: Server Received Data')
      io.emit('getbuffer',data)
    });

    socket.on('disconnecting',function(e)
    {
      console.log(`Disconnect Pending by Stream Server: ${PORT}| ${peerPORT} due to `,e)
      for(let room of this.rooms){
        if(room !== this.id)
        {try{          
          delete current_users[room][this.id]
          io.to(room).emit('User-Disconnect',this.id)}
        catch{
          console.log('Universal Room: Disconnect by ',this.id)
        }

        }
      }
    });

//////////////////////////////////////////////////// Socket.IO Peer Connection Events /////////////////////////////////////////////////

  socket.on('join-room', (roomID) => 
  {
    if(!current_users[roomID])
    {
      current_users[roomID] = {};
    }
    socket.join(roomID)
    current_users[roomID][socket.id]='Active'

    io.to(socket.id).emit('my-user-connected', {myUserID:socket.id,current_users:current_users[roomID],mySocket:socket.id})
    socket.to(roomID).emit('user-connected', {newUserID:socket.id,current_users:current_users[roomID],mySocket:socket.id})

  })
});

console.log('Node Server: Listening on PORT',PORT)
console.log('Peer Server: Listening on PORT',peerPORT)
console.log('WS Server: Listening on PORT',wsPORT)
http.listen(PORT, '192.168.7.237')
phttp.listen(peerPORT,'192.168.7.237')
wshttp.listen(wsPORT,'192.168.7.237')


