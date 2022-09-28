import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import React  from 'react';
import '../React_Notes/css/Notes_App.css';
import {NotesHeader} from '../React_Notes/components/NotesHeader'
import {NotesListPage} from '../React_Notes/pages/NotesListPage'
import {NotesNotePage} from '../React_Notes/pages/NotesNotePage'
import {Default} from '../Universal/components/Default'
import {notes_dir} from './Admin'


let Notes= ({ResetApp}) =>{
  return (
    <Router>
      <div className="NA_dark">
        <div className = "NA_app"><NotesHeader />
          <Routes>
            <Route path={`${notes_dir}`} element ={<NotesListPage/>} /> 
            <Route path={`${notes_dir}note/:id/`} element ={<NotesNotePage/>} /> 
            <Route path='/react/' element ={<Default ResetApp={ResetApp}/>} /> 
          </Routes>
        </div>

      </div>
    </Router>
  );
}

export {Notes}