import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {WebCam} from './WebCam'


let WebCamWrapper = () => {
    const params = useParams()
    const navigate =  useNavigate()

    return(
        <WebCam navigate={(e) => {navigate(e)}} params={params}/>
    )
}
export {WebCamWrapper }

