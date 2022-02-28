import React,{Component} from 'react'
import {Link} from 'react-router-dom'
import {ContentSharing_dir, domain} from '../../apps/Admin'
import {port} from '../../apps/Admin'

export class CSHomePage extends Component {
    constructor(props){
        super(props);
        this.state={
            roomCode:null
        }
        this.navigate=this.props.navigate
        this.fetchuserdata= async () => {
            let response = await fetch(`${domain}${port}/api/react/rooms/user_sessions/`);
            let data = await response.json()
            this.setState({
                roomCode:data.code
            })
            if(this.state.roomCode !== null){
                this.navigate(ContentSharing_dir.concat('room/',this.state.roomCode,'/'))
            }
        }
    }
    async componentDidMount(){
        this.fetchuserdata()
    }
    render(){
        return (
        <div className="CSBackground">
            <div className="CSHomePage">

                    <div className="div1"><Link to={`${ContentSharing_dir}create/`}><div>Create a Room</div></Link></div>
                    <div className="div2">
                        <div className='join'>
                            <Link to={`${ContentSharing_dir}join/`}>Join a Room</Link>
                        </div>
                        <div className='author'>by ShareContent.org</div>
                    </div>

            </div>
        </div>
    )
    }
}

