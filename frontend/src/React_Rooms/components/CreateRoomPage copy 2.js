import React, {Component} from 'react'
import {domain,rooms_dir} from '../../apps/Admin'
import '../css/Rooms.css'


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
            let response = await fetch(`${domain}/api/react/rooms/create/`,requestOptions);
            let data = await response.json()
            this.navigate(rooms_dir.concat('room/',data.code,'/'))
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
            let response = await fetch(`${domain}/api/react/rooms/update/`,requestOptions);
            await response.json();
            window.location.href=rooms_dir.concat('room/',this.props.roomCode,'/')
            return alert('Room Updated Successfully')
            
        }
    }
    render(){
        return (
            <div className="Rooms_Main">
                <div className="Rooms_Main_Side"></div>
                <div className="Rooms_Main_Mid Rooms_Inner_Col">
                    <div className="Rooms_Div"></div>
                    <div className="Rooms_Div"></div>
                    <div className="Rooms_Div"></div>
{/*                     <button id = "Roomsb1" onClick={this.handleCreateRoomClicked}>Create</button>
                    <button id = "Roomsb2"  to={rooms_dir} onClick = {() => this.navigate(rooms_dir)}>Back</button>
                    <button onClick = {() => {this.handleUpdate()}} >Update</button> */}
                </div>
                <div className="Rooms_Main_Side"></div>
                
            </div>
    )}
}

