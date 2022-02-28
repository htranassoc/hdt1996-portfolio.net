import React, {Component} from 'react'
import '../css/RoomCss.css'
import {ContentSharing_dir,domain} from '../../apps/Admin'
import {CreateRoomPage} from './CreateRoomPage'
import error_image from '../../Universal/images/Room_Error.jpg'
import {Link} from 'react-router-dom'
import {Player} from './Player'
import {port} from '../../apps/Admin'

export class Room extends Component{
    constructor(props){
        super(props);
        this.props = props
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
        this.debug_false=null
        this.navigate=this.props.navigate
        this.roomCode=this.props.params.roomCode
        this.exitroom = async () => {
            const requestOptions={
                method: 'DELETE',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    votes_to_skip: this.state.votesToSkip,
                    guest_can_pause: this.state.guestCanPause,
                }),}
            let response = await fetch(`${domain}${port}/api/react/rooms/${this.roomCode}/`,requestOptions);
            await response.json()
            this.navigate(ContentSharing_dir)
            return true
        }
        this.updateShowSettings = (value) =>{
            if(this.state.showSettings===true){
                this.setState({showSettings:false})
                
                return false
            }
            this.setState({
                showSettings:value
            })
           
        }
        this.authenticateSpotify = async () => {
            let response = await fetch(`${domain}${port}/spotify/is_authenticated/`)
            let data = await response.json()
            this.setState({SpotifyAuth: data.status})
            console.log('Authenticated status return - SPOTIFY', data.status)
            if(this.debug===false){this.debug_false=true}
            else{this.debug_false=false}
            if (data.status === this.debug_false){
                let response = await fetch(`${domain}${port}/spotify/get_auth_url/`)
                let data = await response.json()
                window.location.replace(data.url) //redirect us to spotify authentication page
                console.log('Finished get AUTH URL - SPOTIFY')
            } 
            return true

        }
        this.showSettingDetails = () => {
            return (
                <div className="MiniSettings">
                    <CreateRoomPage roomCode = {this.state.roomCode}/>
                </div>
            )
        }
        this.modifyCreatePage = () => {
            let element = document.getElementById('Create_Title')
            element.innerHTML='Update Room'
            var update_button = document.getElementById('update_div')
            update_button.classList.remove('hidden')
        }

        this.renderSettingsButton = () =>{
            return(
                    <div className="divb1"><button id="RoomButton1" onClick={() => {this.updateShowSettings(true)}}>Settings</button></div>
            )
        }
        this.getcurrentsong = async () => {
            let response = await fetch(`${domain}${port}/spotify/current_song/`);
            if(response.ok){
                let data = await response.json();
                this.setState({song: data});
                if(data.title !== this.state.prevsong){console.log('New Song: Reset Timer');this.setState({prevsong: data.title}); this.setState({alt_time:0})}
            }
            return true
        }  
        this.getdata= async () => {
            let response = await fetch(`${domain}${port}/api/react/rooms/${this.roomCode}/`);
            let data = await response.json()
            if(data['Room Found']){
                console.log('No Join Key')
                return(this.setState({status: 0,errorcode:data.errorcode}))
            }
            else if (data['Room Not Found']){
                console.log('Room does not exist')
                return(this.setState({status: 2,errorcode:data.errorcode}))
            }
            
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.user_is_host,
                roomCode:data.code
            });
            if(this.state.isHost === this.debug){
                console.log('................ Calling Authentication')
                await this.authenticateSpotify()}
            return true
        }

        this.postHostData= async () => {
            const requestOptions={
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
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
            let response = await fetch(`${domain}${port}/spotify/postHostData/`,requestOptions);
            await response.json() 
        }
        this.getHostData= async () => {
            let response = await fetch(`${domain}${port}/spotify/getHostData/`);
            let data = await response.json();
            this.setState({song: data})
            console.log(data,'Guest')
        }

    }

     async componentDidMount(){
        await this.getdata()
        console.log('DidMount after getdata', this.state.isHost, this.state.SpotifyAuth)
        if(this.state.isHost){
            this.hostgetinterval=setInterval(this.getcurrentsong,1000)
            this.hostpostinterval=setInterval(this.postHostData,1000)
        }
        else if (this.state.isHost===false){
            this.getcurrentsong()
            this.guestInterval=setInterval(this.getHostData,1000)}
        this.interval=setInterval(this.updatetime,1000)

        
        return (console.log('Finished Mounting'))
    } 
    componentDidUpdate(){
        if(this.state.showSettings===true){this.modifyCreatePage()}
        else{
            this.showSettingDetails()}
        
    }
    componentWillUnmount(){
        clearInterval(this.interval)
        if(this.state.isHost){
            clearInterval(this.hostpostinterval);
            clearInterval(this.hostgetinterval)}
        clearInterval(this.guestInterval)
    }
    
    render(){
        if(this.state.status=== 1)
        {
            return(            
            <div className="Room">
                
                <div className="Top_Buttons">
                    {this.state.isHost===this.debug? this.renderSettingsButton():null}
                    {this.state.showSettings===true?this.showSettingDetails():null}
                    
                    <div className="divb2"><button id="RoomButton2" onClick={()=>{this.exitroom()}}>Exit Room</button></div>
                </div>

                <Player player={this.state.song}>....</Player>
            </div>)
        }
        else if(this.state.status === 0)
        {
            return (
            <div className="Access_Error">
                <img className="error_image" src = {error_image} alt=''></img>
                <div>No Access Code: HTML Error {this.state.errorcode}</div>
                <div>Please go to &nbsp;<Link style={{color:"blue"}} to={`${ContentSharing_dir}join`}>Join Page</Link> &nbsp; for access</div>
            </div>)}
        else{
            return (
                <div className="Access_Error">
                    <img className="error_image" src = {error_image} alt=''></img>
                    <div>Non-Existent Room: HTML Error {this.state.errorcode}</div>
                    <div>Please go to &nbsp;<Link style={{color:"blue"}} to={`${ContentSharing_dir}join`}>Join Page</Link> &nbsp; for access</div>
                </div>)
        }
    }
}
