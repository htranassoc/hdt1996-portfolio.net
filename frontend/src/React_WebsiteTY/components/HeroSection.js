import React from 'react';
import '../Apps.css';
import { Button } from './Button';
import './HeroSection.css';
//import {Background} from '../../Universal/components/Background'
import Video3 from '../videos/video-3.mp4'

const HeroSection = () => {
  return (
    <div className='hero-container'>

      <video className="video2" src ={Video3} autoPlay loop muted></video>
      <h1>ADVENTURE AWAITS !</h1> 
      <br></br>
      <p>What are you waiting for?</p>

      <div className='hero-btns'>
        <Button
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Button>
        <Button
          className='btns'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
        >
          WATCH TRAILER <i className='far fa-play-circle' />
        </Button>
      </div>
    </div>
  );
}

export {HeroSection};
