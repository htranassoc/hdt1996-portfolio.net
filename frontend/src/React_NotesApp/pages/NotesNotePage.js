
import React, {useState, useEffect} from 'react'
import {useParams,useNavigate} from 'react-router-dom'
import { ReactComponent as ArrowLeft } from '../assets/chevron-left.svg';
import {notes_dir,domain} from '../../apps/Admin'
import {port} from '../../apps/Admin'

const NotesNotePage= () =>{
let params = useParams();
let navigate = useNavigate();
let note_id=params.id
let [note,setNote] = useState(null);


let updateNote = async () => {
    await fetch(`${domain}${port}/api/react/notes/${note_id}/`,
    {
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'},
        body: JSON.stringify(note)
        })
    navigate(notes_dir,)
}

let createNote = async () => {
    if(note===null){console.log('Note Empty - Will Not Create'); navigate(notes_dir);return 0};
    await fetch(`${domain}${port}/api/react/notes/`,
    {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'},
        body: JSON.stringify(note)
        })
    ;navigate(notes_dir,)
}

let deleteNote = async () => 
{
    await fetch(`${domain}${port}/api/react/notes/${note_id}/`,
    {
        method: 'DELETE',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(note),
    });
    navigate(notes_dir,);
}

let handleSubmit = () => {
    if(note_id !== 'new' && note.body === '' && note.title === '')
    {console.log('Note - Fully Empty; Deleting');deleteNote()}

    else if(note_id !== 'new' && note.body !== '')
    {console.log('Note - Updated');updateNote()}

    else if(note_id !== 'new' && note.body === '')
    {console.log('Note - Updated');updateNote()}

    else if (note_id === 'new' && note !== null)
    {console.log('Note - Create');createNote()}

    else if (note_id === 'new' && note === null)
    {console.log('Empty - Note: Do Nothing');navigate(notes_dir,)}
}

useEffect(() => {
    let getNote = async () => {
        if(note_id === 'new'){return 0}
        let response = await fetch(`${domain}${port}/api/react/notes/${note_id}/`)
        let data = await response.json()
        setNote(data)
    }
    getNote();
    return () => {console.log('Fetch Completed')}
},[note_id])

if(note!==null || note_id=== "new")
{
    return (
        <div className="note">
            <div className="note-header">
                <h3>
                    <ArrowLeft onClick ={handleSubmit}/>
                </h3>
                {note_id !== 'new' ? 
                <button onClick = {deleteNote}>Delete</button>
                :
                <button onClick = {createNote}>Create</button>}

            </div>
            <br></br>

            {note_id !== 'new'?
            <div>
                <input className ="input"   onChange={(t) =>{setNote({...note, 'title':t.target.value})} } value = {note.title} placeholder = 'Insert Title'></input>
                <br></br>
                <textarea onChange={(t) =>{setNote({...note, 'body':t.target.value})} } value = {note.body}></textarea>
            </div>
            :
            <div>
                <input className ="input"   onChange={(t) =>{setNote({...note, 'title':t.target.value})} } placeholder='Insert Title'></input>
                <br></br>
                <textarea onChange={(t) =>{setNote({...note, 'body':t.target.value})} } placeholder='Insert Notes'></textarea>
            </div>
            }
            
        </div>)
}
else
{
    return (<div></div>)
}

}
export{NotesNotePage}