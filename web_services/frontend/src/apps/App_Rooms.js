import React from 'react'

import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import {Default} from '../Universal/components/Default'
import {rooms_dir} from './Admin'
import { AllWrapper} from '../React_Rooms/components/AllWrapper'



export class Rooms extends React.Component {
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
            <Route path={rooms_dir} element={<AllWrapper app = {rooms_dir} slug = ''/>}/>
            <Route path={`${rooms_dir}join/`} element = {<AllWrapper app = {rooms_dir} slug = 'join'/>}/> 
            <Route path={`${rooms_dir}room/:roomCode/`} element = {<AllWrapper app = {rooms_dir} slug = 'room'/>}/> 
            <Route path={`${rooms_dir}create/`} element = {<AllWrapper app = {rooms_dir} slug = 'create'/>}/> 
            <Route path='/react/' element ={<Default ResetApp={this.ResetApp}/>} /> 
          </Routes>
        </Router>
      );
    }
  }
