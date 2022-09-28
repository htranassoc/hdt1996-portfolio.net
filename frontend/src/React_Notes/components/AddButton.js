import React from 'react'
import {Link} from 'react-router-dom'
import {ReactComponent as AddIcon} from '../assets/add.svg'
import {notes_dir} from '../../apps/Admin'
import '../css/Notes_App.css'

const AddButton = () => {
    return (
        <Link to={`${notes_dir}note/new/`} className="NA_floating_button">
            <AddIcon />
        </Link>
    )
}

export{AddButton}
