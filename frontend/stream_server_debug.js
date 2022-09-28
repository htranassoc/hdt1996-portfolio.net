const webSocketPort = 8005;
const wsPort = 8006;


const express = require("express"); 
const react_server = express();
const fs = require("fs");
const path = require("path")
const http = require('http').Server(react_server)

const wshttp = require('http').Server(react_server)

const io = require('socket.io')(http,{
  maxHttpBufferSize: 1e9,
  cors:true,
  cors: {
    origin: ["http://localhost:3000",'http://192.168.0.37:8001','https://hdt1996-portfolio.me:8001','http://98.208.30.235:8001/'],
    methods: ["GET", "POST"]},
    transports:['websocket','polling'] ,
    pingTimeout:120000,
    pingInterval:60000
})

const webSocketServer = require('websocket').server;



const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

react_server.get("/",function (req,res){
    res.sendFile(__dirname + "/index.html")})


react_server.get("/content/videos", function (req, res){
    let range = req.headers.range;
    if (!range) {
        res.status(400).send("Requires Range header");
      }
    let videoPath = "video-1.mp4"
    let videoSize = fs.statSync(videoPath).size;
    let chunkSize = 10 ** 6;
    let start = Number(range.replace(/\D/g, "")); 
    let end = Math.min(start + chunkSize,videoSize-1); 
    let contentLength= end - start + 1;
    let headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`, // NOT A FORMULA, just a description of the start i, end i, and size
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    res.writeHead(206,headers);
    let stream = fs.createReadStream(videoPath, {start, end })
    stream.pipe(res);
})


/////////////////////////////////////// webSocket Server for Chat and Generating USER-ID for filesharing/////////////////////////////////////////////////////////////



const wsServer = new webSocketServer({
  httpServer: wshttp
});

const clients = {};
const groups = {};

wsServer.on('request', function (req) {
  var userID = getUniqueID();
  console.log(`${new Date} | Connection from origin: ${req.origin}`);

  const connection = req.accept(null, req.origin);
  clients[userID] = connection;
  connection.on('message', function(message) {
    data=JSON.parse(message.utf8Data)
    
    if (message.type === 'utf8') {
      if (data.type==='req_userID')
        {
          clients[userID].sendUTF(JSON.stringify({req_userID:userID}))
        }
      else
        {
        for(key in clients) 
          {
          clients[key].sendUTF(message.utf8Data);
          }
        }
    }
  })

}); 


//////////////////////////////////////////// socketIO Server for File Sharing Events //////////////////////////////////////////////////////////////////////////////

let getTime = () => {
  let timestamp=new Date()
  let date=`${timestamp.getMonth()}/${timestamp.getDate()}/${timestamp.getFullYear()} | `
  let hours = String(timestamp.getHours())
  let minutes = String(timestamp.getMinutes())
  let seconds = String(timestamp.getSeconds())
  if(hours.length === 1){hours=`0${hours}`}
  if(minutes.length === 1){minutes=`0${minutes}`}
  if(seconds.length === 1){seconds=`0${seconds}`}
  let time=`${hours}:${minutes}:${seconds}`

  return time
};

io.on("connection", async function(socket)
{
  console.log('Connected to Socket')
  let fileShare={} //Can update this dictionary in socket function wrapper
  
  socket.on("checkID",function(data)
    {
      if(data.userID === undefined || data.userID === null){socket.disconnect();console.log('Disconnected')}
      //console.log('Client sent ', data, 'Status',' userID: ',data.userID)
      socket.join(data.userID)
    });

  socket.on('client_file_share',async function(data) //1 Received from client the metadata and buffer, called within SendFile function
    {

      //io.to(data.senderID).emit('getbuffer',data)
      //socket.broadcast.emit('getbuffer',data) //transmits metadata, buffer, senderID
      console.log('Server: Received Data')
      io.to(data.senderID).emit('response','Client Confirm: Server Received Data')
      io.emit('getbuffer',data) //transmits metadata, buffer, senderID
    });

  socket.on('disconnect',function(e)
    {
      console.log('Disconnected by Stream Server due to ',e)
    });

/*   socket.on('ping',function(data){
    let current_time = getTime()
    console.log('Pinged')
    socket.emit('pong',[data,current_time])
  }) */

});


http.listen(webSocketPort, '192.168.0.37')
wshttp.listen(wsPort,'192.168.0.37')


