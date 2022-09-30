import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {Main} from './Main'


let Wrapper = () => {
    const params = useParams()
    const navigate =  useNavigate()

    return(
        <Main navigate={(e) => {navigate(e)}} params={params}/>
    )
}
export {Wrapper }

