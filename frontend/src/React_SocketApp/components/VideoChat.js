import React,{Component} from 'react';
import '../css/WebCam.css'
import {domain,port,scroll_size} from '../../apps/Admin'
import {io} from 'socket.io-client'
import peerjs from 'peerjs';
import hang_up from '../images/hang_up.svg'
import close_user from '../images/close_user.png'
import call from '../images/call.svg'
import pending_call from '../images/pending_call.gif'
import call_failed from '../images/call_failed.svg'


export class VideoChat extends Component{
    constructor(props){
        super()
        this.props=props
        this.ROOM_ID = this.props.params.id
        this.peer=null;
        this.socket=null;
        this.myID=null;
        this.mySocket=null;
        this.userName='Test'

        this.myVideoStream=null
        this.state = {
            video_ids:{},
            current_users:{},
            slider_clicked:false,
            post_slide:'30%',
            call_status:{}
        };
        this.awaitUserStream= async(call,video) =>{
            let promise_result;
            await new Promise((resolve,reject) => {
                let rejection = setTimeout(() => 
                {
                    reject('Expired')
                },7500);

                call.on("stream",(userVideoStream)=> {
                    clearTimeout(rejection)
                    this.addVideoStream(video,userVideoStream);
                    resolve(userVideoStream)
                })
            }).catch(function(e)
            {
                promise_result = e
            });
            if(promise_result){
                let element = document.getElementById(`user_${call.peer}`);
                element.querySelector('.user_item_loading').src=call_failed
                call.off("stream")
                return console.log('Call Failed')
            }
            let element = document.getElementById(`user_${call.peer}`)
            element.querySelector('.user_item_loading').remove()
            element.querySelector('.user_item_hangup').classList.remove('hidden')
            element.querySelector('.user_item_call').classList.add('hidden')

            call.off("stream")
        }
    
        this.awaitSocketID= async(socket) =>{
            await new Promise(resolve => {
                socket.on('connect',()=>{
                    this.mySocket = socket.id
                    resolve(this.mySocket)
                }) 
            });
            socket.off('connect')
        }
    
        this.callAllUsers = (userIDs) => {
            if(this.myVideoStream === null){return console.log('Video needs to be active before call')}
            let users = Object.keys(userIDs)
            for(let user in users){
                let userID = users[user]
                let loading

                let element = document.getElementById(`user_${users[user]}`)
                if(element.querySelector('.user_item_loading'))
                {
                    loading = element.querySelector('.user_item_loading');           
                    loading.src=pending_call
                }
                else
                {
                    loading = document.createElement('img');
                    loading.classList.add('user_item_loading')
                    loading.src=pending_call
                    element.append(loading)
                }
                let call = this.peer.call(users[user],this.myVideoStream);
                let video = document.createElement("video");
                video.autoplay=true
                video.id=`video_${users[user]}`

                let arr = this.state.video_ids
                arr[userID]='Active_Video'
    
                let arr2 = this.state.call_status
                arr2[userID]=call

                this.setState({video_ids:arr,call_status:arr2})

                this.awaitUserStream(call,video)
            }
        };
        this.callAUser = (userID) => {
            let loading;

            let element = document.getElementById(`user_${userID}`)
            if(element.querySelector('.user_item_loading'))
            {
                loading = element.querySelector('.user_item_loading');           
                loading.src=pending_call
            }
            else
            {
                loading = document.createElement('img');
                loading.classList.add('user_item_loading')
                loading.src=pending_call
                element.append(loading)
            }
            let call = this.peer.call(userID, this.myVideoStream);
            let video = document.createElement("video");
            video.autoplay=true
            video.id=`video_${userID}`
            let arr = this.state.video_ids
            arr[userID]='Active_Video'

            let arr2 = this.state.call_status
            arr2[userID]=call
            this.setState({video_ids:arr,call_status:arr2})

            
            this.awaitUserStream(call,video) 
        }
    
        this.addVideoStream = (video, stream) => {
            let src;
            let Video_Stream=document.getElementById('video-grid')
            if('srcObject' in video){
                video.srcObject = stream;
                src = video.srcObject
    
            }
            else if ('src' in video){
                video.src = URL.createObjectURL(stream)
                src = video.src
            }
            else{
                console.log('\n\n No src at all \n\n')
            }
    
            if(src !== undefined)
            {
                video.addEventListener('loadedmetadata',function(){
                    Video_Stream.append(video)
                })
                
            }
    
        };
    
        this.createMediaStreamFake = () => {
            return new MediaStream([this.createEmptyAudioTrack(), this.createEmptyVideoTrack({ width:640, height:480 })]);
        }
    
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
    
        
        this.userStream = async () => {
            let myVideo = document.createElement("video")
            myVideo.muted = true;
            myVideo.autoplay = true;
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
            console.log('Before web_device_count',web_device_count)
            if(web_device_count === 0)
                {
                    console.log('Executed')
                    let emptyStream = this.createMediaStreamFake()
                    this.myVideoStream = emptyStream;
                    this.addVideoStream(myVideo, this.myVideoStream);
                }
            else
            {
                console.log('Executed')
                let stream = await navigator.mediaDevices.getUserMedia({audio: true,video: true,})
                console.log('After await stream')
                this.myVideoStream = stream;
                this.addVideoStream(myVideo, this.myVideoStream);
            }
        }
        this.handleSlide = (e) => {
            let element = document.getElementById('main')
            if(e.type==='mousedown')
            {

                element.onmouseup=(e) => {this.handleSlide(e)}
                return this.setState({slider_clicked:true})
            }
            else if (e.type ==='mouseup')
            {
                this.setState({slider_clicked:false})
                return element.removeAttribute('onmouseup')
            }
            else
            {
                if(this.state.slider_clicked === true){
                    let slide_size = (window.screen.width-2*scroll_size)*.0025/2
                    this.setState({post_slide:`${window.screen.width-e.pageX-2*scroll_size-slide_size}px`})
                }
            }

        }
        this.removeAfterDisconnect = (data) => {
            let videoIDs = this.state.video_ids
            let currentusers = this.state.current_users

            if(videoIDs[data])
            {
                let vid_element = document.getElementById(`video_${data}`)
                console.log(vid_element)
                //vid_element.remove()
                delete videoIDs[data]
            }
            if(currentusers[data])
            {            
                let user_element = document.getElementById(`user_${data}`)
                console.log(user_element)
                //user_element.remove()
                delete currentusers[data]
            }
        }
        this.renderConnectedUserList = (element,userID) => {
            let div = document.createElement('div')
            let div_child_boot = document.createElement('img')
            let div_child_user = document.createElement('div')
            let div_child_hangup=document.createElement('img')
            let div_child_call = document.createElement('img')


            div.classList.add('user_item')
            div.id=`user_${userID}`

            div_child_boot.classList.add('user_item_boot')
            div_child_boot.src=close_user
            div_child_boot.onclick=() => {this.socket.emit('req-disconnect-user',{userID:userID,roomID:this.ROOM_ID})}

            div_child_user.classList.add('user_item_name')
            div_child_user.innerHTML=userID

            div_child_hangup.classList.add('user_item_hangup','hidden')
            div_child_hangup.src=hang_up
            div_child_hangup.onclick= () => {
                if(this.state.video_ids[userID])
                {
                    let callstatus = this.state.call_status
                    callstatus[userID].close()
                    this.removeAfterDisconnect(userID)
                }
                else{alert(`${userID} is not in active call`)}

            }

            div_child_call.classList.add('user_item_call')
            div_child_call.src=call
            div_child_call.onclick = () => {
                this.callAUser(userID)
            }

            div.append(div_child_boot)
            div.append(div_child_user)
            div.append(div_child_hangup)
            div.append(div_child_call)
            element.append(div)
        }
        this.initSocketEvents = async (socket) => {
            await socket.on('connect_error',function(e){
                console.log(e)
            })
    
            await socket.on('disconnect',()=>{
                console.log('Disconnected from Socket.IO Server ...........................');
            })
    
            await socket.on("user-connected",(data)=>{
                let user_data = data.current_users
                delete user_data[this.myID]
                this.setState({current_users:user_data})
    
                let element = document.getElementById('current_user_list')
                let users = Object.keys(user_data)
                for(let user in users)
                {
                    this.renderConnectedUserList(element,users[user])
                }
                
                console.log('New Connection: New User ID is ', data.newUserID, '\n Other users in room: ',this.state.current_users)
            })
    
            await socket.on("my-user-connected",(data)=>{ //Will use socketID instead of WebSocket Generated ID, but will use WebSocket to determine UserName/Password
                let user_data = data.current_users
                this.myID = data.myUserID
                delete user_data[this.myID]
                this.setState({current_users:user_data})
                let element = document.getElementById('current_user_list')
                let users = Object.keys(user_data)
                for(let user in users)
                {
                    this.renderConnectedUserList(element,users[user])
                }
                console.log('New Connection: My User ID is ', data.myUserID, '\n Other users in room: ',this.state.current_users)
            })
    
            await socket.on('User-Disconnect',(data)=>{
                console.log(data)
                this.removeAfterDisconnect(data)
            })

            await socket.on('confirm-user-removal',(data) => alert(data))

            await socket.on('force-disconnect-user',(data) => {alert(data); this.peer.disconnect();this.socket.disconnect()})
        }
    }

    async componentDidMount(){
          
        console.log('Mounted')

        this.socket = await io.connect(`${domain}${port}`,{withCredentials: true}); //$port
        await this.awaitSocketID(this.socket)
        await this.initSocketEvents(this.socket)


        this.peer = new peerjs(this.mySocket, 
            {
                path: "/peerjs",
                host: '/',
                port: port.replace(':',''),
                debug: 3,
                withCredentials: true
            })

        this.peer.on("open", (id) => {
            console.log('Peer: Opened with ID: ',id)
            this.socket.emit("join-room", this.ROOM_ID);
        });

        this.peer.on("call", (call) => 
        {
            if(this.myVideoStream !== null)
            {
                call.answer(this.myVideoStream)
            }
            let video = document.createElement("video");
            video.autoplay= true
            video.id=`video_${call.peer}`

            let arr = this.state.video_ids
            arr[call.peer]='Active_Video'

            let arr2 = this.state.call_status
            arr2[call.peer]=call
            this.setState({video_ids:arr,call_status:arr2})

            call.on("stream",(userVideoStream)=> {
                this.addVideoStream(video,userVideoStream);
            })
        });

        this.peer.on('error',function(e){console.log(e)})

    }
    render(){
        console.log('\n\n Rendered \n\n')
        return(
       
            <div>
                <div id="main" className="main" onMouseMove={(e) => {this.handleSlide(e)}} >  
                    <div className="main__left" >
                        <div className="videos__group">
                            <div id="video-grid"></div>
                        </div>
                    </div>

                    <div className="slide_right" onMouseDown={(e) => {this.handleSlide(e)}} ></div>
                    <div className="main__right" style = {{width:this.state.post_slide}}>
                        <div className="main__message_container">
                            <div className="MyUserandVideo">
                                <div><button id="ConnectAll" onClick={() => {this.callAllUsers(this.state.current_users)}}> Connect to All</button></div>
                                <div className="My_Info">
                                    <div id="MyInfoR1">
                                        <div id="label"> My ID: </div> 
                                        <div id="myID">{this.myID}</div>
                                    </div>
                                    <div id="MyInfoR2">
                                        <div id="label"> UserName: </div>
                                        <div id="userName"> {this.userName}</div>
                                    </div>
                                    
                                </div>
                                <div><button id="EnableVideo" onClick={() => {this.userStream()}}> Turn on Video</button> </div>
                            </div>
                        
                            <div className = "current_user_title">Connected Users</div>
                            <div id="current_user_list" className="current_user_list"></div>
                        </div>
                    </div>

            </div>
        </div>
        )
    }
    
}

