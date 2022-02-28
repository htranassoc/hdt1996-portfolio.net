import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import React from 'react'
import {Default} from '../Universal/components/Default'
import {msweep_dir} from './Admin'
import {Board} from '../React_Minesweeper/components/Board'
import '../Universal/css/Admin.css'
let MineSweeper= ({ResetApp}) =>{
  return (
    <Router>
          <Routes>
            <Route path={`${msweep_dir}`}  element ={<Board/>} /> 
            <Route path='/react/' element ={<Default ResetApp={ResetApp}/>} /> 
          </Routes>
    </Router>
  );
}

export {MineSweeper}