import '../css/SlideShow.css';
import {importAll} from '../../index'
import React  from 'react';
//import Video1 from '../videos/Space.mp4'
const videos = importAll(require.context('../videos', false, /\.(mp4)$/));


const Background = () =>{
  return (
    <div className="video-wrapper">
        <video className="video" src ={videos['Space.mp4']} autoPlay loop muted />
    </div>
  );
}

export {Background}

