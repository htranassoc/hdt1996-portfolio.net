import React, { Component } from 'react'
import '../css/Videos.css'
import {domain} from '../../apps/Admin'

export class VideoPlayer extends Component {
    constructor(props) {
        super(props);
        this.props=props
        this.state = {
            videoId: this.props.params.id,
            videoData: {},
            time:0,
            duration:null
        };
        this.getDuration = () => {
            let element = document.getElementById(`Video_${this.state.videoData.id}`)
            let changeState = (value)=> {this.setState({duration:value})}
            element.ondurationchange= function(){changeState(this.duration)
            }
        }
        this.rounder = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,      
            maximumFractionDigits: 2,
         });
         this.updatetime = () => {        
            if(this.state.time >= this.state.duration){
                this.setState({time:0+.2})}
            else{
                this.setState({time:this.state.time+.2})
            }
        }
         this.getData = async () =>{
            let response = await fetch(`${domain}:8001/api/react/Videos/${this.state.videoId}/`);
            let data = await response.json();
            this.setState({videoData: data});
         }

    }   
    componentDidMount() {
        this.getData()
        this.getDuration()
    }

    render() {
        return (
            <div className="VideoContainer">
                <div className="Video">
                    <video id = {`Video_${this.state.videoData.id}`} src={`${domain}:8001${this.state.videoData.media}`} controls autoPlay muted loop></video>
                <div className="Video_Length">Length: {this.rounder.format(this.state.duration)} Seconds</div>
                </div>
            </div>
        )
    }
}