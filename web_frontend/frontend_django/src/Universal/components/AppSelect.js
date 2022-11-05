import React from 'react'
import {Link} from 'react-router-dom'

const AppSelect = ({app,onClick,Destination}) => {
  if(app === 'VideoChat'){Destination = `/react/${app}/1`}
    return (
        <div onClick={onClick}>
          <button>
            <Link to = {Destination} >
              {app.replace('_',' ')}
            </Link>
          </button>
        </div>
    )
}

export{AppSelect}