import React from 'react'

import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import {Default} from '../Universal/components/Default'
import {dashboard_dir} from './Admin'
import {Wrapper} from '../React_Dashboard/components/Wrapper'



export class Dashboard extends React.Component {
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
            <Route path={`${dashboard_dir}:roomCode/`} element = {<Wrapper/>}/> 
            <Route path={`${dashboard_dir}`} element = {<Wrapper UserData = {this.props.UserData} />}/> 
            <Route path='/react/' element ={<Default ResetApp={this.ResetApp}/>} /> 
          </Routes>
        </Router>
      );
    }
  }
