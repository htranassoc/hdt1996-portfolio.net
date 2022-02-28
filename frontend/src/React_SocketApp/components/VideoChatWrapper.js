import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import '../css/WebCam.css'
import {VideoChat} from './VideoChat'


let VideoChatWrapper = () => {
    const params = useParams()
    const navigate =  useNavigate()

    return(
        <VideoChat navigate={(e) => {navigate(e)}} params={params}/>
    )
}
export {VideoChatWrapper}

