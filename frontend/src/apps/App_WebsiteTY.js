import React from 'react';
import {Navbar} from '../React_WebsiteTY/components/Navbar';
import '../React_WebsiteTY/Apps.css';
import {Home} from '../React_WebsiteTY/components/pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {Services} from '../React_WebsiteTY/components/pages/Services';
import {Products} from '../React_WebsiteTY/components/pages/Products';
import {SignUp} from '../React_WebsiteTY/components/pages/SignUp';
import {web_dir} from './Admin'
import {Default} from '../Universal/components/Default'


const WebsiteTY=({ResetApp}) =>{
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path={`${web_dir}`}  element = {<Home/>}/>
        <Route path={`${web_dir}services/`} element={<Services/>} />
        <Route path={`${web_dir}products/`} element={<Products/>} />
        <Route path={`${web_dir}sign-up/`} element={<SignUp/>} />
        <Route path='/react/' element ={<Default ResetApp={ResetApp}/>} /> 
      </Routes>
    </Router>
  );
}

export{WebsiteTY};


