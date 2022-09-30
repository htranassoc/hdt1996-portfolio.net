import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import {VideoHome} from './VideoHome'
import {VideoPlayer} from './VideoPlayer'

let VideoWrapper = ({slug}) =>{
    const params = useParams()
    const navigate =  useNavigate()
    if (slug === ''){
        return(
              <VideoHome navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if( slug === 'player'){
        return(
              <VideoPlayer navigate={(e) => {navigate(e)}} params={params}/>
        )}
    }

export {VideoWrapper}