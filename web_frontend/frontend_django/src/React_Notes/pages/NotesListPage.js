import React, {useState, useEffect} from 'react'
import {NotesListItem} from '../components/NotesListItem'
import {AddButton} from '../components/AddButton'
import {domain} from '../../apps/Admin'
import '../css/Notes_App.css'

const NotesListPage = () => 
{   
    let [notes, setNotes]=useState([]) //argument to use state sets default initial state, will be overwritten depending on two let variables {initial, updater}

    let getNotes = async() => //use async and await to ensure completion of promise and return for fetching data; include updater function to change array for render
    {
        let response = await fetch(`${domain}/api/react/notes/`)
        let data = await response.json()
        if(data['detail']){return console.log(data)}
        setNotes(data)
        //console.log(notes) // should be able to get variable only once just after setVariable

    }

    useEffect(() => 
    {   console.log('List - useEffect Triggered')
        getNotes()
        return () => [console.log('Fetch Completed')]
    },[])


    return (
        <div className="NA_notes">
            <div className="NA_notes_header">
                <h2 className = "NA_notes_title">
                    &#9782; Notes
                </h2>
                <p className ="NA_notes_count">{notes.length}
                </p>
            </div>    

            <div className="NA_notes_list">
                {notes.map
                    (
                        (note, index) => 
                        (
                        <NotesListItem key={index} note={note}/>
                        )
                    )
                }
            </div>
            <AddButton/>
        </div>
    )
}

export{NotesListPage}
