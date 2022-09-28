import React from 'react'
import '../css/MS.css'

const Dead = ({onClick}) => {

    return(
        <div>
            <div className="MS_gameover" >YOU ARE DEAD</div>
            <button onClick = {onClick} className="MS_Restart">RESTART</button>
        </div>
    )
}

export {Dead}