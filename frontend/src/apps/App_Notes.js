import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"
import React  from 'react';
import '../React_NotesApp/css/Notes_App.css';
import {NotesHeader} from '../React_NotesApp/components/NotesHeader'
import {NotesListPage} from '../React_NotesApp/pages/NotesListPage'
import {NotesNotePage} from '../React_NotesApp/pages/NotesNotePage'
import {Default} from '../Universal/components/Default'
import {notes_dir} from './Admin'


let NotesApp= ({ResetApp}) =>{
  return (
    <Router>
      <div className="dark">
        <div className = "app"><NotesHeader />
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

export {NotesApp}