import React,{useEffect, useState, Component} from 'react';
import {useParams} from 'react-router-dom';
import '../css/WebCam.css'
import {domain,port} from '../../apps/Admin'
import {io} from 'socket.io-client'
import peerjs from 'peerjs';


let VideoChat = () => {
    console.log('Rendered Page')

    const params = useParams()
    const ROOM_ID = params.id
    let Video_Stream
    let peer
    let myID, mySocket
    let current_users = {}
    let video_ids={}

    let myVideoStream;

    let awaitUserStream= async(call,video) =>{
        await new Promise(resolve => {
            call.on("stream",(userVideoStream)=> {
                addVideoStream(video,userVideoStream);
                resolve(userVideoStream)
            })
        });
        call.off("stream")
    }

    let awaitSocketID= async(socket) =>{
        await new Promise(resolve => {
            socket.on('connect',()=>{
                mySocket = socket.id
                resolve(mySocket)
            }) 
        });
        socket.off('connect')
    }

    const connectToNewUser = (userIDs) => {
        let users = Object.keys(userIDs)
        for(let user in users){
            console.log(peer)
            let call = peer.call(users[user],myVideoStream);
            let video = document.createElement("video");
            video.autoplay=true
            video.id=`video_${users[user]}`
            video_ids[users[user]]='Active_Video'
            awaitUserStream(call,video)
        }
    };

    const addVideoStream = (video, stream) => {
        let src;
        Video_Stream=document.getElementById('video-grid')
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

    const createMediaStreamFake = () => {
        return new MediaStream([createEmptyAudioTrack(), createEmptyVideoTrack({ width:640, height:480 })]);
  }

    const createEmptyAudioTrack = () => {
        const ctx = new AudioContext();
        const oscillator = ctx.createOscillator();
        const dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        const track = dst.stream.getAudioTracks()[0];
        return Object.assign(track, { enabled: false});
    }
    
    const createEmptyVideoTrack = ({ width, height }) => {
        const canvas = Object.assign(document.createElement('canvas'), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
      
        const stream = canvas.captureStream();
        const track = stream.getVideoTracks()[0];
      
        return Object.assign(track, { enabled: true });
    };

    
    const userStream = async (myVideo) => {
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
        if(web_device_count === 0)
            {
                let emptyStream = createMediaStreamFake()
                myVideoStream = emptyStream;
                addVideoStream(myVideo, myVideoStream);
            }
        else
        {
            let stream = await navigator.mediaDevices.getUserMedia({audio: true,video: true,})
            myVideoStream = stream;
            console.log('Before addVideoStream')
            addVideoStream(myVideo, myVideoStream);
        }
    }

    useEffect(async () => {
          
        console.log('Mounted')
        
        const socket = await io.connect(`${domain}`,{withCredentials: true}); //$port
        socket.on('connect_error',function(e){
            console.log(e)
        })

        socket.on('disconnect',()=>{
            console.log('Disconnected from Socket.IO Server ...........................');
        })

        socket.on("user-connected",function(data){
            current_users = data.current_users
            delete current_users[myID]
            let element = document.getElementById('current_user_list')
            let users = Object.keys(current_users)
            for(let user in users){
                let div = document.createElement('div')
                div.classList.add('current_user_item')
                div.id=`user_${users[user]}`
                div.innerHTML=users[user]
                element.append(div)
            }

            
            console.log('New Connection: New User ID is ', data.newUserID, '\n Other users in room: ',current_users)
        })

        socket.on("my-user-connected",function(data){
            myID = data.myUserID
            console.log('New Connection: My User ID is ', data.myUserID, '\n Other users in room: ',current_users)
        })

        socket.on('User-Disconnect',function(data){
            console.log(data)
            if(video_ids[data])
            {
                let vid_element = document.getElementById(`vid_${data}`)
                console.log(vid_element)
                vid_element.remove()
            }
            let user_element = document.getElementById(`user_${data}`)
            console.log(user_element)
            user_element.remove()

        })

        await awaitSocketID(socket)

        peer = new peerjs(mySocket, 
            {
                path: "/peerjs",
                host: '/',
                debug: 3,
                withCredentials: true
            })

        peer.on("open", (id) => {
            console.log('Peer: Opened with ID: ',id)
            socket.emit("join-room", ROOM_ID);
        });

        peer.on("call", (call) => 
        {
            if(myVideoStream !== null)
            {
                call.answer(myVideoStream)
            }
            let video = document.createElement("video");
            video.autoplay= true
            video.id=`video_${call.peer}`
            video_ids[call.peer]='Active_Video'
            call.on("stream",(userVideoStream)=> {
                addVideoStream(video,userVideoStream);
            })
        });

        peer.on('error',function(e){console.log(e)})
        console.log(peer)

    },[])
    
    
    return(
       
        <div>
            <div className="main">  
            <div className="main__left">
                <div className="videos__group">
                    <div id="video-grid"></div>
                </div>
                <div className="options">
                    <div className="options__left">
                        <div id="stopVideo" className="options__button">Turn off All Streams</div>
                        <div id="muteButton" className="options__button">Mute All Streams</div>
                    </div>
                    <div className="options__right">
                        <div id="inviteButton" className="options__button">Invite Another User</div>
                    </div>
                </div>
            </div>

            <div className="main__right">
                <div className="main__chat_window">

                </div>
                <div className="main__message_container">
                    <div className="Buttons_1">
                        <button id="ConnectAll" onClick={() => {connectToNewUser(current_users,peer)}}> Connect to All</button>
                        <button id="EnableVideo" onClick={() => {userStream(document.createElement("video"))}}> Turn on Video</button> 
                    </div>
                
                    <div id="current_user_list" className="current_users"></div>
                </div>
            </div>
        </div>
    </div>
    )
}

export {VideoChat}

