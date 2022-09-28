const node = (PORT,peerPORT,wsPORT) => {
  
  const express = require("express"); 
  const fs = require("fs");
  const path = require("path");
  const {ExpressPeerServer} = require("peer");
  const wsServer = require('websocket').server;
  const host = require('./node_config').host
  const domain = require('./node_config').domain
  const debug = require('./node_config').debug
  const base_dir = require('./node_config').base_dir
  
  
  const node_server = express();
  let http,phttp,wshttp
  
  
  node_server.set("view engine",'ejs');
  
  ////////////////////////////////////// HTTP/S Servers //////////////////////////////////////////////////////////////
  
  if(debug === false){
    http = require('https').Server(
    {
      key: fs.readFileSync(path.join(base_dir,'key_p1.pem')),
      cert: fs.readFileSync(path.join(base_dir,'cert_p1.pem'))
    },node_server)
  
    phttp = require('https').Server(
      {
        key: fs.readFileSync(path.join(base_dir,'key_p1.pem')),
        cert: fs.readFileSync(path.join(base_dir,'cert_p1.pem'))
      },node_server)
    
    
    wshttp = require('https').Server(
      {
        key: fs.readFileSync(path.join(base_dir,'key_p1.pem')),
        cert: fs.readFileSync(path.join(base_dir,'cert_p1.pem'))
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
        origin: [`http://${host}`],
        credentials: true,
        methods: ["GET", "POST"]},
    })
    
  
  /////////////////////////////////////////// PeerJS Server /////////////////////////////////////////////////////////
  
    
    const peerServer = ExpressPeerServer(phttp, 
      {
        credentials: true,debug: true,
        cors: {
        origin: [domain,'http://localhost:3000',`http://${host}`],
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
  
  ws.on('request', (req) =>{
    var userID = getUniqueID();
    console.log(`${new Date} | Connection from origin: ${req.origin}`);
  
    const connection = req.accept(null, req.origin);
    wsclients[userID] = connection;
    connection.on('message', (message) =>{
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
  
  let stream_status
  ping_client()
  io.on("connection", async (socket) =>
  
  {
    stream_status = true
    console.log(socket.id,'Connected to Socket')
    
    socket.on('pong', (data) =>{
      console.log('pong')
    });
  
    socket.on("checkID",(data) =>
      {
        if(data.userID === undefined || data.userID === null){socket.disconnect();console.log('Disconnected')}
        socket.join(data.userID)
      });
  
    socket.on('client_file_share',async (data) => 
      {
        if (stream_status === false){return console.log('No more transport')}
        io.to(data.senderID).emit('response','Client Confirm: Server Received Data')
        io.emit('getbuffer',data)
      });
  
    socket.on('disconnecting',(e) =>
      {
        stream_status = false
        console.log(`Disconnect Pending by Stream Server: ${PORT}| ${peerPORT} due to `,e);
        console.log(socket.rooms)
        for(let room of socket.rooms){
          if(room !== this.id)
          {try{          
            delete current_users[room][socket.id]
            io.to(room).emit('User-Disconnect',socket.id)}
          catch{
            console.log('Universal Room: Disconnect by ',socket.id)
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
  
      io.to(socket.id).emit('my-user-connected', {myUserID:socket.id,current_users:current_users[roomID]})
      socket.to(roomID).emit("new_user_connected", {newUserID:socket.id})
  
    });

    socket.on('req_disconnect_user',data => {
      current_users[data.roomID][data.userID]='Removing'
      io.to(data.userID).emit('force_disconnect_user',`You are removed from ${data.roomID}`)
      io.to(data.roomID).emit('notify_room_user_removed',`${data.userID} is forcibly disconnected`)
    })

    socket.on('req_hang_up_user',data => {
      socket.to(data.userID).emit('call_closed_user',data)
    })

    socket.on('req_call_action',data => {
      io.to(data.recipient).emit('recipient_call_action',data)
      io.to(data.caller).emit('recipient_call_action',data)
    })
    
  });
  
  console.log('Node Server: Listening on PORT',PORT)
  console.log('Peer Server: Listening on PORT',peerPORT)
  console.log('WS Server: Listening on PORT',wsPORT)
  http.listen(PORT, host)
  phttp.listen(peerPORT,host)
  wshttp.listen(wsPORT,host)
  
  
  
}

module.exports={node:node}

