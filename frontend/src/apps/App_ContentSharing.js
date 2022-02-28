import React from 'react'

import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import {Default} from '../Universal/components/Default'
import {ContentSharing_dir} from './Admin'
import { AllWrapper} from '../React_ContentSharing/components/AllWrapper'
import '../Universal/css/Admin.css'



export class ContentSharing extends React.Component {
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
            <Route path={ContentSharing_dir} element={<AllWrapper slug = ''/>}/>
            <Route path={`${ContentSharing_dir}join/`} element = {<AllWrapper slug = 'join'/>}/> 
            <Route path={`${ContentSharing_dir}room/:roomCode/`} element = {<AllWrapper slug = 'room'/>}/> 
            <Route path={`${ContentSharing_dir}create/`} element = {<AllWrapper slug = 'create'/>}/> 
            <Route path='/react/' element ={<Default ResetApp={this.ResetApp}/>} /> 
          </Routes>
        </Router>
      );
    }
  }
