import React, {Component} from 'react'
import '../css/Rooms.css'
import {domain} from '../../apps/Admin'
import {CreateRoomPage} from './CreateRoomPage'
import error_image from '../../Universal/images/Room_Error.jpg'
import {Link} from 'react-router-dom'
import {Player} from './Player'
import { WebCamWrapper } from '../../React_StreamChat/components/WebCamWrapper'

export class Room extends Component{
    constructor(props){
        super(props);
        this.props = props
        this.app = this.props.app
        this.state={
            votesToSkip:2,
            guestCanPause:false,
            isHost:false,
            roomCode:'',
            status:1,
            errorcode:null,
            showSettings:false,
            SpotifyAuth:false,
            prevsong:{},
            song:{},
            alt_time:0
        };
        this.debug=true;
        this.auth_status=null
        this.navigate=this.props.navigate
        this.roomCode=this.props.params.roomCode

        this.intervalPromise = async () => 
        {
            let timer
            await new Promise(resolve => 
            {
                this.getcurrentsong()
                
                timer = setTimeout(() => {resolve()},1000)
            })
            clearTimeout(timer)
            return this.intervalPromise()
        }
        this.exitroom = async () => 
        {
            let requestOptions=
            {
                method: 'DELETE',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    votes_to_skip: this.state.votesToSkip,
                    guest_can_pause: this.state.guestCanPause,
                }),
            }
            let response = await fetch(`${domain}/api/react/rooms/${this.roomCode}/`,requestOptions);
            await response.json()
            this.navigate(this.app)
            return true
        }
        this.updateShowSettings = (value) =>{
            if(this.state.showSettings===true)
            {
                this.setState({showSettings:false})
                return false
            }
            this.setState({showSettings:value})
        }
        this.authenticateSpotify = async () => 
        {
            let response = await fetch(`${domain}/spotify/is_authenticated/`)
            let data = await response.json()
            this.setState({SpotifyAuth: data.status})
            console.log('Authenticated status return - SPOTIFY', data.status)
            if(this.debug===false){this.auth_status=true}
            else{this.auth_status=false}
            if (data.status === this.auth_status)
            {
                let response = await fetch(`${domain}/spotify/get_auth_url/`)
                let data = await response.json()
                window.location.replace(data.url) //redirect us to spotify authentication page
                console.log('Finished get AUTH URL - SPOTIFY')
            } 
            return true

        }
        this.showSettingDetails = () => {
            return (
                <div className="Rooms_MiniSettings">
                    <CreateRoomPage roomCode = {this.state.roomCode}/>
                </div>
            )
        }
        this.modifyCreatePage = () => {
            let element = document.getElementById('Rooms_Create_Title')
            element.innerHTML='Update Room'
            let update_button = document.getElementById('Rooms_update_div')
            console.log(update_button)
            //update_button.classList.remove('Rooms_hidden')
        }

        this.renderSettingsButton = () =>{
            return(
            <div className="Rooms_divb1">
                <button id="Rooms_Setting_Btn" onClick={() => {this.updateShowSettings(true)}}>Settings</button>
            </div>)
        }
        this.getcurrentsong = async () => 
        {
            let response = await fetch(`${domain}/spotify/current_song/`);
            let data = await response.json();
            if (data !== 'No Song' && data !== 'No Room')
            {
                this.setState({song: data});
                if(data.title !== this.state.prevsong)
                {
                    console.log('New Song: Reset Timer');
                    this.setState({prevsong: data.title,alt_time:0});
                }
                this.postHostData()
                return true
            }

        }  
        this.getdata= async () => {
            let response = await fetch(`${domain}/api/react/rooms/${this.roomCode}/`);
            let data = await response.json()
            if(data['Room Found'])
            {
                console.log('No Join Key')
                return(this.setState({status: 0,errorcode:data.errorcode}))
            }
            if (data['Room Not Found'])
            {
                console.log('Room does not exist')
                return(this.setState({status: 2,errorcode:data.errorcode}))
            }
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.user_is_host,
                roomCode:data.code
            });
            if(data.user_is_host === this.debug)
            {
                await this.authenticateSpotify()
                return true
            }
            return false
        }

        this.postHostData= async () => 
        {
            console.log(this.state.song)
            let requestOptions=
            {
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify(
                {
                    title:this.state.song.title,
                    artist:this.state.song.artist, 
                    code:this.state.roomCode,
                    votes:this.state.song.votes,
                    duration:this.state.song.duration,
                    time:this.state.song.time,
                    image_url:this.state.song.image_url,
                    is_playing:this.state.song.is_playing 
                }),
            };
            let response = await fetch(`${domain}/spotify/postHostData/`,requestOptions);
            await response.json() 
        }
        this.getHostData= async () => {
            let response = await fetch(`${domain}/spotify/getHostData/`);
            let data = await response.json();
            this.setState({song: data})
            console.log(data,'Guest')
        }
    }

     async componentDidMount()
     {
        let data = await this.getdata()
        /*
        if(data === true){
            this.intervalPromise()
        }
        else
        {
            this.guestInterval=setInterval(this.getHostData,1000)
        }
        this.interval=setInterval(this.updatetime,1000) */

        
        return
    } 
    componentDidUpdate()
    {
        if(this.state.showSettings===true){this.modifyCreatePage()}
        else{this.showSettingDetails()}
    }
    componentWillUnmount()
    {
        clearInterval(this.interval)
        clearInterval(this.guestInterval)
    }
    
    render(){
        
        if(this.state.status=== 1)
        {
            return(            
            <div className="Rooms_Room">
                
                <div className="Rooms_Top_Menu">
                    <div className="Rooms_Inner_Row" id="Rooms_Top_Buttons">
                        {this.state.isHost!==this.debug? this.renderSettingsButton():null}
                        {this.state.showSettings===true?this.showSettingDetails():null}
                        
                        <div className="Rooms_divb2">
                            <button id="Rooms_Leave_Btn" onClick={()=>{this.exitroom()}}>Exit Room</button>
                        </div>
                    </div>
                </div>

                {/* <Player player={this.state.song}>....</Player> */}
                <div id="SA_WebCamWrapper">
                    <WebCamWrapper></WebCamWrapper>
                </div>
            </div>)
        }
        if(this.state.status === 0)
        {
            return (
            <div className="Rooms_Access_Error">
                <img className="Rooms_error_image" src = {error_image} alt=''></img>
                <div>No Access Code: HTML Error {this.state.errorcode}</div>
                <div>Please go to &nbsp;<Link style={{color:"blue"}} to={`${this.app}join`}>Join Page</Link> &nbsp; for access</div>
            </div>)
        }
        
        return (
            <div className="Rooms_Access_Error">
                <img className="Rooms_error_image" src = {error_image} alt=''></img>
                <div>Non-Existent Room: HTML Error {this.state.errorcode}</div>
                <div>Please go to &nbsp;<Link style={{color:"blue"}} to={`${this.app}join`}>Join Page</Link> &nbsp; for access</div>
            </div>)
        
    }
}
