import React from 'react'
import {Link} from 'react-router-dom'

const AppSelect = ({app,ChangeApp,to}) => {
    return (
        <div>
        <button><Link to = {to} onClick={ChangeApp}>
          {app.replace('_',' ')}
        </Link></button>
        </div>
    )
}

export{AppSelect}