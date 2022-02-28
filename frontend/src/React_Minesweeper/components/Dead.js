import React from 'react'
import '../css/MS.css'

const Dead = ({onClick}) => {

    return(
        <div>
            <div className="gameover" >YOU ARE DEAD</div>
            <button onClick = {onClick} className="Restart">RESTART</button>
        </div>
    )
}

export {Dead}