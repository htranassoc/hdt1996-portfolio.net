import React from 'react'

import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import {Default} from '../Universal/components/Default'
import {spotify_dir} from './Admin'
import { AllWrapper} from '../React_Spotify/components/AllWrapper'



export class Spotify extends React.Component {
    constructor(props) 
    {
      super(props);
      this.props=props
      this.ResetApp= this.props['ResetApp']
    }
    render() {
      return (
        
        <Router>
          <Routes>
            <Route path={spotify_dir} element={<AllWrapper app = {spotify_dir} slug = ''/>}/>
            <Route path={`${spotify_dir}join/`} element = {<AllWrapper app = {spotify_dir}  slug = 'join'/>}/> 
            <Route path={`${spotify_dir}room/:roomCode/`} element = {<AllWrapper app = {spotify_dir}  slug = 'room'/>}/> 
            <Route path={`${spotify_dir}create/`} element = {<AllWrapper app = {spotify_dir}  slug = 'create'/>}/> 
            <Route path='/react/' element ={<Default ResetApp={this.ResetApp}/>} /> 
          </Routes>
        </Router>
      );
    }
  }
