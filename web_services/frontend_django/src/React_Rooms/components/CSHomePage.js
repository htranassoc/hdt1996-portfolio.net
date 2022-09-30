import React,{Component} from 'react'
import {domain} from '../../apps/Admin'
import '../css/Rooms.css'
import { RoomJoin } from './RoomJoin'
import { CreateRoomPage } from './CreateRoomPage'
import { Home } from '../../React_Forum/components/Home'

export class CSHomePage extends Component {
    constructor(props){
        super(props);
        this.props = props
        this.state={
            roomCode:null,
            join:false,
            listings:false,
            create:false,
        }

        this.navigate=this.props.navigate
/*         this.fetchuserdata= async () => {
            let response = await fetch(`${domain}/api/react/rooms/user_sessions/`);
            let data = await response.json()
            this.setState({
                roomCode:data.code
            })
            if(this.state.roomCode !== null){
                this.navigate(this.props.app.concat('room/',this.state.roomCode,'/'))
            }
        } */
        this.showClicked = (value) => {
            this.setState({[value]:true})
        }
    }
    /* async componentDidMount(){
        this.fetchuserdata()
    } */
    render(){
        return (
            <div className="Rooms_Main">
                <div className="Rooms_Main_Mid Rooms_Inner_Row">
                    <div className="Rooms_Div">
                        {this.state.join===true?
                            <RoomJoin/>
                        :
                            <button id="Rooms_Button" onClick={()=>this.showClicked('join')}>Join a Room with Code</button>
                        }
                    </div>
                    <div className="Rooms_Div">
                        {this.state.create===true?
                            <CreateRoomPage close = {() => this.setState({create:false})}app = {this.props.app} navigate = {(e) => this.navigate(e)}/>
                        :
                            <button id="Rooms_Button" onClick={()=>this.showClicked('create')}>Create a New Room</button>
                        }
                    </div>
                    <div className="Rooms_Div">
                        {this.state.listings===true?
                            <div id="Rooms_Full"><Home /></div>
                        :
                            <button id="Rooms_Button" onClick={()=>this.showClicked('listings')}>View Rooms in Listings</button>
                        }
                    </div>
                </div>
            </div>
    )
    }
}

