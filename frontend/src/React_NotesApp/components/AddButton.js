import React from 'react'
import {Link} from 'react-router-dom'
import {ReactComponent as AddIcon} from '../assets/add.svg'
import {notes_dir} from '../../apps/Admin'

const AddButton = () => {
    return (
        <Link to={`${notes_dir}note/new/`} className="floating-button">
            <AddIcon />
        </Link>
    )
}

export{AddButton}
