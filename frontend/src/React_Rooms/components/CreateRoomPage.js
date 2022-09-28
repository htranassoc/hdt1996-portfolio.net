import React, {Component} from 'react'
import {domain} from '../../apps/Admin'
import '../../React_Spotify/css/Spotify.css'

export class CreateRoomPage extends Component{
    defaultVotes=2;
    constructor(props){
        super(props);
        this.props=props
        this.state={
            guestCanPause:true,
            votesToSkip:this.defaultVotes,
            title:null,
            category:null,
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
                    category: this.state.category,
                    title: this.state.title
                }),
            };
            if(this.state.votesToSkip < 1){
                alert('Votes to Skip must be more than zero')
                return false
            }
            let response = await fetch(`${domain}/api/react/rooms/create/`,requestOptions);
            let data = await response.json();
            if (data['Error'])
            {
                return console.log('\n\n ERROR', data, '\n\n')
            }
            console.log(this.props.app)
            this.navigate(this.props.app.concat('room/',data.code,'/'))
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
            window.location.href=this.props.app.concat('room/',this.props.roomCode,'/')
            return alert('Room Updated Successfully')
            
        }
    }

    render(){
        return (
            <div className="RCS_CreateRoom">
                <div className="RCS_CR_Wrapper">
                    <div id="RCS_Create_Title" className="RCS_Create_Title">
                    Create a Room
                    </div>

                    <div className="RCS_InputField RCS_CRW_Sub">
                        <div className="RCS_Input_Title">Title</div>

                        <div className="RCS_Input_Input">
                            <input className="RCS_Input_Type" placeholder='Enter here...' onChange={(e) => {this.setState({title:e.target.value})}}></input>
                        </div>
                        
                    </div>

                    <div className="RCS_InputField RCS_CRW_Sub">
                        <div className="RCS_Input_Title">Category</div>

                        <div className="RCS_Input_Input">
                            <input className="RCS_Input_Type" placeholder='Enter here...'  onChange={(e) => {this.setState({category:e.target.value})}}></input>
                        </div>
                        
                    </div>
                    <div className="RCS_InputField RCS_CRW_Sub">
                        <div className="RCS_Input_Title">
                            <div>Guest Control</div>
                        </div>
                        <div className="RCS_Pause_Buttons">
                            <div>
                                <input id = 'Radio_Choose1' type="radio" value="true"  onClick={(e)=>{this.handleGuestPauseChange(e)}}></input>
                                <label>Play/Pause</label>
                            </div>
                            <div>
                                <input id = 'Radio_Choose2' type="radio" value="false"  onClick={(e)=>{this.handleGuestPauseChange(e)}}></input>
                                <label>No Control</label>
                            </div>
                        </div>
                    </div>

                    <div className="RCS_InputField RCS_CRW_Sub">
                        <div className="RCS_Input_Title">Votes to Skip Song</div>

                        <div className="RCS_Input_Input">
                            <input className="RCS_Input_Type" min="1" type="number" defaultValue={this.defaultVotes} onChange={(e) => {this.setState({votesToSkip:e.target.value})}}></input>
                        </div>
                        
                    </div>


                    <div className="RCS_User_Action" id="RCS_User_Action">
                        <div><button id = "RCS_Create_Btn" onClick={this.handleCreateRoomClicked}>Create</button></div>
                        <div><button id = "RCS_Update_Btn"  to={this.props.app} onClick = {() => this.props.close()}>Back</button></div>
                        <div className="RCS_update_btn RCS_hidden" id="RCS_update_div">
                            <button onClick = {() => {this.handleUpdate()}} >Update</button>
                        </div>
                    </div>
                </div>
            </div>
    )}
}

