import React, { Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import '../css/SocketApp.css'
import {io} from 'socket.io-client'
import {domain, deploy_status, port} from '../../apps/Admin'

let wsdomain
if(deploy_status === false){
    wsdomain = domain.replace('http','ws')
}
else{
    wsdomain = domain.replace('https','wss')
}

var fileShare={}
fileShare.transmitted={};
fileShare.buffer={}
fileShare.progress=0
fileShare.byteLengths={}
fileShare.progress={}

var userName = ''
var newMessage = ''

export class Home extends Component {
    constructor() {
        super()
        this.websockets={};
        this.state = {
            userID:'',
            isLoggedIn: false,
            messages:{},
            metadata:{},
            buffer:[],
            download_id:'',
            upload_id:'',
            progression_style:{width:0}
        }
        this.getTime = (e) => {
            let timestamp=new Date()
            let date=`${timestamp.getMonth()}/${timestamp.getDate()}/${timestamp.getFullYear()} | `
            let hours = String(timestamp.getHours())
            let minutes = String(timestamp.getMinutes())
            let seconds = String(timestamp.getSeconds())
            if(hours.length === 1){hours=`0${hours}`}
            if(minutes.length === 1){minutes=`0${minutes}`}
            if(seconds.length === 1){seconds=`0${seconds}`}
            let time=`${hours}:${minutes}:${seconds}`
            if(e === 'timestamp'){return `${date}${time}`}
            return time
        };
        
        this.sendMessage = (value,type,msg_id,file_name) =>{
            this.websockets.client.send(JSON.stringify({
                type: type,
                message: value,
                message_id:msg_id,
                userName: userName,
                time: this.getTime('timestamp'),
                userID: this.state.userID,
                file_name:file_name
            })) 
        }
        this.loginbutton = () => {
            let element = document.getElementById("Input_UserName")
            element.value=""
            this.setState({isLoggedIn: true})
            this.websockets.socket.emit('checkID',
                {
                    Status:'Connected',
                    userName: userName,
                    userID:this.state.userID
                }
            );
            this.addkeypress()
            
        }
        this.messagebutton = () =>{
            if(newMessage===''){
                return alert('No message to send')
            }
            let msg_id=this.getUniqueID()
            let element = document.getElementById("Input_Message")
            element.value=""
            this.sendMessage(newMessage,'message',msg_id)
            newMessage=''
        }
        this.addkeypress = () =>{
            let msgbutton= () => {this.messagebutton()}
            let lgnbutton = () => {this.loginbutton()}
            if(document.querySelector('#Input_Message')){
                document.querySelector('#Input_Message').addEventListener('keypress',function(e){
                    if(e.key === 'Enter'){msgbutton()}})}
            if(document.querySelector('#Input_UserName')){
                document.querySelector('#Input_UserName').addEventListener('keypress',function(e){
                    if(e.key === 'Enter'){lgnbutton()}})}
        }
        this.updateMessage = (msg_id)=>{
            let arr= this.state.messages
            if(arr[msg_id].userID === this.state.userID){
                arr[msg_id].message="Successfully Uploaded"
                arr[msg_id].complete=true
            }
            else{
            arr[msg_id].message="Successfully Downloaded"
            arr[msg_id].complete=true
            }

            return arr
        }
        this.resetfileShare = () =>{
            fileShare={};
            fileShare.transmitted={};
            fileShare.buffer={}
            fileShare.progress=0
            fileShare.byteLengths={}
            fileShare.progress={}
        }

        this.getUniqueID = () => {
            const random = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            
            let loop = () => {
                let unique = []
                let result = ''
                for(let i=0;i<3;i++)
                {
                    unique.push(random())
                }
                result = unique.join('.')
                return result
            }
            let code = loop()
            if(this.state.messages[code]){code=loop()}
            return String(code);
          };
 
        this.addFileEvent = (e) => 
        {
            let time = () => this.getTime()
            let userID=this.state.userID
            let sender_emit = (event,data) => this.websockets.socket.emit(event,data)
            let chunkResponse= async() =>{
                await new Promise(resolve => {
                    this.websockets.socket.on('response',data => {
                        resolve(data)
                    })
                });
                this.websockets.socket.off('response')
            }

            if(e.target.files.length === 0){return console.log('No file')}
            if(e.target.files.length >= 1)
            {
                for(let item = 0; item < e.target.files.length;item++){
                    let msg_id = this.getUniqueID()
                    let file = e.target.files[item]
                    let file_split = file.name.split('.')
                    let file_type = file_split.pop().toLowerCase()
                    let file_string_name=file_split[0]
                    this.sendMessage(`${userName} Uploading file...`,'upload',msg_id,file.name)
                    
                    let reader = new FileReader();
                    reader.onload = async () =>
                    {
                        let buffer = reader.result;
                        let data=
                            {
                                file_name:file_string_name,
                                file_type:file_type,
                                total_buffer_size: buffer.byteLength,
                                buffer_size:1024**3/100//Change according to anticipated system RAM, max can only be RAM size.
                            }
        
                        if(!fileShare.start){fileShare.start=time()}
        
                        let barr = new Uint8Array(buffer),
                            chunk,
                            initial = 0,
                            next,
                            count = 0
        
                        let innerloop = async function() 
                        {
                            while(initial !==  data.total_buffer_size)
                            {
                                count+=1
                                if(initial + data.buffer_size >= data.total_buffer_size)
                                {
                                    next =  data.total_buffer_size;
                                    chunk=  barr.subarray(initial,next)
                                    
                                    sender_emit('client_file_share',{chunk:chunk,metadata:data,startTime:fileShare.start,count:count,msg_id:msg_id,byteLength:data.total_buffer_size,senderID:userID})
                                    await chunkResponse()
                                    console.log('Last Chunk sent by Sender-Client')
        
                                    return true
                                }

                                next= initial + data.buffer_size;
                                chunk= barr.subarray(initial,next)
                                
                                sender_emit('client_file_share',{chunk:chunk,count:count,msg_id:msg_id,byteLength:data.total_buffer_size,senderID:userID})
                                //await chunkResponse()
                                initial =  next
                            }
                        }
                        innerloop()
                    }
                    reader.readAsArrayBuffer(file)
                }
                let element = document.getElementById("Input_File")
                element.type=''
                element.type='file'
            }
        }
    }

    componentDidMount(){
        console.log('Mounted')

        this.websockets.client = new W3CWebSocket(`${wsdomain}${port}/ws/`) //change to wss on deployed
        this.websockets.socket = io.connect(`${domain}${port}`,{withCredentials: true});
        this.websockets.socket.on('connect_error',function(e){
            console.log(e)
        })
        let websockets_socket = this.websockets.socket
        this.websockets.socket.on('ping', function(data){
            websockets_socket.emit('pong', `${data}: Received by Client`);
        });
        this.websockets.socket.on('connect',function(){
            console.log('Connected!')
        })
        let time = () => this.getTime()
        let changeState = (key,value) => this.setState({[key]:value})
        let updateMessage = (msg_id) => this.updateMessage(msg_id)
        let userID = () => this.state.userID

        this.websockets.client.onopen = () =>{
            this.websockets.client.send(JSON.stringify({
                type: "req_userID",
                data:'req_userID'
            })) 
        }

        this.websockets.client.onmessage = (msg) => 
        { 
            let arr = this.state.messages

            let msgdata = JSON.parse(msg.data)
            if(msgdata.req_userID){return this.setState({userID:msgdata.req_userID})} 
               
            if(msgdata.type==='upload' && msgdata.userID !== this.state.userID)
            {
                msgdata.type = 'download';
                msgdata.message = `Downloading file from ${msgdata.userID}`
                msgdata.complete = false
                arr[msgdata.message_id]=msgdata
                return this.setState({messages:arr},() => {console.log('Updated Message')})
            }
            if (msgdata.type ==='message'){
                arr[msgdata.message_id]=msgdata
                return this.setState({messages:arr},() => {console.log('Updated Message')}) 
            }
            if(msgdata.type ==='upload' && msgdata.userID === this.state.userID)
            {
                msgdata.type='download'
                arr[msgdata.message_id]=msgdata
                msgdata.complete=false
                return this.setState({messages:arr}) 
            }
        } 

        this.websockets.socket.on('disconnect',function(e){console.log(e)})

        this.websockets.socket.on('getbuffer',function(data)
        {
            let user = userID()
            let chunk = data.chunk
            if(!fileShare.buffer[data.msg_id]){fileShare.buffer[data.msg_id]=[]}
            fileShare.buffer[data.msg_id].push(chunk)

            if(!fileShare.transmitted[data.msg_id]){fileShare.transmitted[data.msg_id]=0}

            fileShare.transmitted[data.msg_id]+=chunk.byteLength

            if(!fileShare.byteLengths[data.msg_id]){fileShare.byteLengths[data.msg_id]=data.byteLength}

            fileShare.progress[data.msg_id]=fileShare.transmitted[data.msg_id]/fileShare.byteLengths[data.msg_id]*100
            //console.log(fileShare.transmitted[data.msg_id],fileShare.byteLengths[data.msg_id])
            console.log(fileShare.progress[data.msg_id])

            changeState('progression_style',{[data.msg_id]:{width:`${fileShare.progress[data.msg_id]}%`}})
            if(data.metadata )
            {
                let arr=updateMessage(data.msg_id)
                changeState('messages',arr)
                let download_file=new Blob(fileShare.buffer[data.msg_id])
                let element = document.createElement('a')
                if(user !== data.senderID){
                    if('download' in element)
                    {
                        element.type = 'download'
                        element.href = URL.createObjectURL(download_file)
                        element.download = `${data.metadata.file_name}${Math.floor(Math.random() * (1-9999999))}.${data.metadata.file_type}`
                        element.click()
                    }
    
                    URL.revokeObjectURL(element.href)
                    element.remove()
                }


                console.log(fileShare.transmitted[data.msg_id], ' bytes Streamed from ',data.metadata.total_buffer_size)
                console.log()

                return console.log('Started: ',data.startTime, ' | Completed at: ',time())
            }
        });
    }

    componentDidUpdate(){
        if(!this.websockets.key_press){
            this.addkeypress()
            this.websockets.key_press='Active'
        }
    }
    componentWillUnmount(){
        this.websockets.socket.disconnect()
    }

    render() 
    {
        if(this.websockets.socket && this.websockets.client)
        {
            let msgs = this.state.messages
            return (
                        <div className="SocketApp">
                        {this.state.isLoggedIn?
                            <div className="ChatRoom">
                                {Object.keys(this.state.messages).map(
                                    (message,id)=>
                                        (
                                        <div className="msghistory" key = {id}>
                                            <div className="msghistory-user">
                                                <div id="ShowUser">{`${msgs[message].userName}: ${msgs[message].userID}`}</div>
                                                <div id="ShowTime">{`${msgs[message].time}`}</div>
                                            </div>
                                            <div className="msghistory-message"> 
                                                <div className="message">{msgs[message].message} </div>
                                                <div className="download">{msgs[message].file_name}</div>
                                            </div>
                                            {
                                            msgs[message].type === 'download'?
                                                <div className="progress_bar">
                                                    {msgs[message].complete===false?
                                                    <div className="progress_slider" style={this.state.progression_style[msgs[message].message_id]}></div>
                                                    :
                                                    <div className="progress_slider" style={{width:'100%'}}></div>
                                                    }
                                                </div>
                                            :
                                            null
                                            }
                                        </div>
                                        )
                                    )
                                }

                                <div className="NewMessage">
                                    <input id="Input_Message" placeholder='Chat...' onChange={(e) => {newMessage=e.target.value}}></input>
                                    <button onClick = {() => {this.messagebutton()}}><div>Send Message</div></button>
                                    <div className="InputFileContainer"><input id = "Input_File" multiple onChange = {(e) => {this.addFileEvent(e)}} type="file"></input></div>
                                </div>
                            </div>
                            
                        :
                            <div className="Login">
                                <input id="Input_UserName" placeholder='Enter Username' onChange={(e) => {userName=e.target.value}}></input>
                                <button onClick={() => this.loginbutton()}><div>Login</div></button>
                            </div>
                        }
                        </div>
                    )
        }
        return null
    }
}