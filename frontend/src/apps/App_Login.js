import React from 'react'

import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import {Default} from '../Universal/components/Default'
import { login_dir } from './Admin';
import { Wrapper } from '../React_Login/components/Wrapper';




export class Login extends React.Component
{
  constructor(props) 
  {
    super(props);
    this.props=props
    this.ResetApp= this.props['ResetApp']
  }
  render()
  {
      return (
        
        <Router>
          <Routes>
            <Route path={login_dir} slug = 'Login' element={<Wrapper/>}/>
            <Route path='/react/' element ={<Default ResetApp={this.ResetApp}/>} /> 
          </Routes>
        </Router>
      );
    }
  }
