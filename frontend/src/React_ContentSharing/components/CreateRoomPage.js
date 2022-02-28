import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import {ContentSharing_dir,domain} from '../../apps/Admin'
import '../css/RoomCss.css'
import {port} from '../../apps/Admin'

export class CreateRoomPage extends Component{
    defaultVotes=2;
    constructor(props){
        super(props);
        this.props=props
        this.state={
            guestCanPause:true,
            votesToSkip:this.defaultVotes,
        };
        this.handleVotesChange=(e)=>{
            this.setState({
                votesToSkip: e.target.value,
            });
            console.log('Executed handleVotes')
        };
        this.navigate=this.props.navigate
    
        this.handleGuestPauseChange=(e)=>{
            let radio_id=e.target.id
            console.log(radio_id)
            if(radio_id==='Radio_Choose1'){
                let element = document.getElementById("Radio_Choose2")
                element.checked=false;
            }
            else{
                let element = document.getElementById("Radio_Choose1")
                element.checked=false;
            }

            this.setState({
                guestCanPause: e.target.value === "true" ? true : false,
            });
            console.log('Executed changePause')
        }
        this.handleCreateRoomClicked= async () => {
            const requestOptions={
                method: 'POST',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    votes_to_skip: this.state.votesToSkip,
                    guest_can_pause: this.state.guestCanPause,
                }),
            };
            if(this.state.votesToSkip < 1){
                alert('Votes to Skip must be more than zero')
                return false
            }
            let response = await fetch(`${domain}${port}/api/react/rooms/create/`,requestOptions);
            let data = await response.json()
            this.navigate(ContentSharing_dir.concat('room/',data.code,'/'))
        }
        this.handleUpdate= async () => {
            const requestOptions={
                method: 'PUT',
                headers:{'Content-Type': 'application/json'},
                body: JSON.stringify({
                    votes_to_skip: this.state.votesToSkip,
                    guest_can_pause: this.state.guestCanPause,
                    code: this.props.roomCode
                }),
            };
            if(this.state.votesToSkip < 1){
                alert('Votes to Skip must be more than zero');
                return false
            }
            let response = await fetch(`${domain}${port}/api/react/rooms/update/`,requestOptions);
            await response.json();
            window.location.href=ContentSharing_dir.concat('room/',this.props.roomCode,'/')
            return alert('Room Updated Successfully')
            
        }
    }
    render(){
        return (
            <div className="CreateRoom">

                <div id="Create_Title" className="Create_Title">
                Create a Room
                </div>

                <div className="PlayBackSettings">
                    <div>Guest Control of Playback State</div>
                </div>
                <div className="PauseSettings">
                    <div>
                        <input id = 'Radio_Choose1' type="radio" value="true"  onClick={(e)=>{this.handleGuestPauseChange(e)}}></input>
                        <label>Play/Pause</label>
                    </div>
                    <div>
                        <input id = 'Radio_Choose2' type="radio" value="false"  onClick={(e)=>{this.handleGuestPauseChange(e)}}></input>
                        <label>No Control</label>
                    </div>
                </div>

                <div className="InputField">
                    <div className="SkipTitle">Votes Required to Skip Song</div>

                    <div className="Input_Number">
                        <input className="NumberSkips" min="1" type="number" defaultValue={this.defaultVotes} onChange={this.handleVotesChange}></input>
                    </div>
                    
                </div>
                <div className="Two_Buttons">
                    <div><button id = "b1" onClick={this.handleCreateRoomClicked}>Create</button></div>
                    <div><button id = "b2" to={ContentSharing_dir} Component={Link}>Back</button></div>
                    <div className="update_btn hidden" id="update_div"><button id="update_button"  onClick = {() => {this.handleUpdate()}} >Update</button></div>
                </div>
                
            </div>
    )}
}

