import React from 'react'
import {Link} from 'react-router-dom'
import {notes_dir} from '../../apps/Admin'
import '../css/Notes_App.css'

let getTitle = (note) =>{
    if(note.title !== null)
    {
        const title = note.title.split('\n')[0]
        if(title.length > 45){
            return title.slice(0,45)
        }
        else{return title}
    }
    else if(note.title === null)
    {
        const title = note.body.split('\n')[0]
        if(title.length > 45){
            return title.slice(0,45)
        }
        else{return title}
    }
}

let getDate = (note) => {
    return new Date(note.updated).toLocaleDateString()
}
const NotesListItem = ({note}) => { //props - immutable form of data, AKA properties or parameters
    //console.log('props',props)
    return (// REMEMBER to use ` NOT ' for Link
        <Link to ={`${notes_dir}note/${note.id}/`}> 
            <div className="NA_notes_list_item">
                <h3>{getTitle(note)}</h3>
                <p><span>{getDate(note)}</span></p>
            </div>
        </Link>
    )
}

export{NotesListItem}
