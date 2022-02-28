import React, {useState, useEffect} from 'react'
import {NotesListItem} from '../components/NotesListItem'
import {AddButton} from '../components/AddButton'
import {domain} from '../../apps/Admin'
import {port} from '../../apps/Admin'

const NotesListPage = () => 
{   
    let [notes, setNotes]=useState([]) //argument to use state sets default initial state, will be overwritten depending on two let variables {initial, updater}

    useEffect(() => 
    {   console.log('List - useEffect Triggered')
        getNotes()
        return () => [console.log('Fetch Completed')]
    },[])

    let getNotes = async() => //use async and await to ensure completion of promise and return for fetching data; include updater function to change array for render
    {
        let response = await fetch(`${domain}${port}/api/react/notes/`)
        let data = await response.json()
        setNotes(data)
        //console.log(notes) // should be able to get variable only once just after setVariable

    }

    return (
        <div className="notes">
            <div className="notes-header">
                <h2 className = "notes-title">
                    &#9782; Notes
                </h2>
                <p className ="notes-count">{notes.length}
                </p>
            </div>    

            <div className="notes-list">
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
