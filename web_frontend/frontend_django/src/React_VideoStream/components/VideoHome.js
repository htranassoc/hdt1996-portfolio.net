import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../css/Videos.css'
import {videostream_dir,domain} from '../../apps/Admin'
export class VideoHome extends Component {
    constructor() {
        super();
        this.state = {
            videos: [],
            duration:[]
        };
        this.getVideos = async () =>{
            let response = await fetch(`${domain}:8001/api/react/Videos/`);
            let data = await response.json();
            let arr = this.state.videos
            arr.push(data)
            this.setState({ videos: arr });
        }
        this.getDuration = () => {
            for(let video in this.state.videos){
                let element = document.getElementById(`Video_${this.state.videos[video].id}`)
                let changeState = (value)=> {let arr = this.state.duration; arr.push(value); this.setState({duration:arr})}
                element.ondurationchange= function(){changeState(this.duration)}
            }
        }
        this.rounder = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,      
            maximumFractionDigits: 2,
         });
    }

    async componentDidMount() {
        console.log('Mounted')
        await this.getVideos()
        this.getDuration()
    }

    componentDidUpdate(){
        console.log('Updated')
    }

    render() {console.log('Rendered')
        return (
                    <div className="VA_VideoContainer">
                        {this.state.videos !== []?this.state.videos.map((video,id) =>
                        <div className="VA_Video" key={video.id}>
                            
                            <Link className= "VA_Link" test={5} to={`${videostream_dir}player/${video.id}`}>
                                <video id={`Video_${video.id}`} src = {`${domain}:8001${video.media}`}></video>
                            </Link>
                            <div className="VA_Video_Length">Length: {this.rounder.format(this.state.duration[id])} Seconds</div>
                        </div>
                        ):<div className="VA_Video" > No Videos</div>}
                    </div>
        )
    }
}