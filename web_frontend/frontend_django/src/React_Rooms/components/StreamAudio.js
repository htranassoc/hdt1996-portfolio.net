import MicRecorder from 'mic-recorder-to-mp3';
import React, {Component} from 'react'

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

export class StreamAudio extends Component{
    constructor(props){
        this.recorder = new MicRecorder({
            bitRate: 128,
            encoder: 'mp3', // default is mp3, can be wav as well
            sampleRate: 44100, // default is 44100, it can also be set to 16000 and 8000.
        });}}
