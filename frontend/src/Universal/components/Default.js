import React, {useEffect} from 'react'


const Default = ({ResetApp}) => {
    useEffect(()=>{
        if((window.location.href==="http://localhost:3000/react/") || (window.location.href==="http://192.168.0.37:8001/react/"))
        {
            ResetApp()
        }
    },)

    return (
        <div>
        </div>
    )
}

export{Default}
