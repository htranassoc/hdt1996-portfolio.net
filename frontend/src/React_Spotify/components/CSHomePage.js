import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {domain} from '../../apps/Admin'
import '../css/Spotify.css'

export class CSHomePage extends Component {
    constructor(props){
        super(props);
        this.props = props
        this.state={
            roomCode:null
        }
        this.app = this.props.app

        this.navigate=this.props.navigate
        this.fetchuserdata= async () => {
            let response = await fetch(`${domain}/api/react/rooms/user_sessions/`);
            let data = await response.json()
            this.setState({
                roomCode:data.code
            })
            if(this.state.roomCode !== null){
                this.navigate(this.app.concat('room/',this.state.roomCode,'/'))
            }
        }
    }
    async componentDidMount(){
        this.fetchuserdata()
    }
    render(){
        return (
        <div className="RCS_CSBackground">
            <div className="RCS_CSHomePage">

                    <div className="RCS_div1"><Link to={`${this.app}create/`}><div>Create a Room</div></Link></div>
                    <div className="RCS_div2">
                        <div className="RCS_join">
                            <Link to={`${this.app}join/`}>Join a Room</Link>
                        </div>
{/*                         <div className="RCS_author">by ShareContent.org</div> */}
                    </div>

            </div>
        </div>
    )
    }
}

