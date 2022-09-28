import React, {useEffect} from 'react'
let origin = 
[
    "http://localhost:3000/react/",
    "http://192.168.1.86:8001/react/",
    "https://hdt1996-portfolio.net/react/",
    "http://127.0.0.1:3000/react/"
]

const Default = ({ResetApp}) => 
{
    useEffect(()=>{
        for(let i in origin)
        {
            if(window.location.href===origin[i]){return ResetApp()}
        }
    },)
    return (<div></div>)
}

export{Default}
