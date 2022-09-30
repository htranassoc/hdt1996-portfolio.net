import React, {Component} from 'react';
import {Card, LinearProgress} from '@material-ui/core'
import {SkipNext,PlayArrow,Pause} from '@material-ui/icons'
import '../css/Rooms.css'
import {domain} from '../../apps/Admin'

export class Player extends Component{
    constructor(props){
        super(props);
        this.props=props;
        
        this.pauseSong = async () =>{
            const requestOptions={
                method: 'PUT',
                headers: {"Content-Type":"application/json"},
            };
            fetch(`${domain}/spotify/pause/`,requestOptions)
        }
        this.playSong = async () =>{
            const requestOptions={
                method: 'PUT',
                headers: {"Content-Type":"application/json"},
            };
            fetch(`${domain}/spotify/play/`,requestOptions)
        }
        this.skipSong = async () =>{
            const requestOptions={
                method: 'POST',
                headers: {"Content-Type":"application/json"},
            };
            fetch(`${domain}/spotify/skip/`,requestOptions)
        }
        this.renderLine = (song_progress) => {
            return(<div><LinearProgress variant="determinate" value = {song_progress} ></LinearProgress></div>)
        }
    }

    render(){
        let song_progress = (this.props.player.time/ this.props.player.duration)*100
        return(
        <Card id="Card" className="RoomsPlayer">


            <div className="RoomsPlayer_Header">
                <img src = {this.props.player.image_url} alt=""></img>
                {this.renderLine(song_progress)}
                <div className="RoomsPausePlayButtons">

                    {!this.props.player.is_playing?
                    <div> <PlayArrow id="PlayerActionButton" onClick={() => {this.playSong()}}/> {this.props.player.is_playing}</div>
                    :<div> <Pause id="PlayerActionButton" onClick={() => {this.pauseSong()}}/> {this.props.player.votes}</div>}
                    <div> <SkipNext id="PlayerActionButton" onClick={() => {this.skipSong()}}/> {this.props.player.votes}</div>
                    

                </div>
                <div className="RoomsTitleArtist">

                    <div>{this.props.player.title}</div>
                    <div>{this.props.player.artist}</div>

                </div>
                
            </div>

        </Card>)
    }
}