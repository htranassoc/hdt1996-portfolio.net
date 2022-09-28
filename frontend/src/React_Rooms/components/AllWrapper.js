import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {Room} from './Room'
import {CSHomePage} from './CSHomePage'
import {CreateRoomPage} from './CreateRoomPage'
import {RoomJoin} from './RoomJoin'
import {WebCamWrapper} from '../../React_StreamChat/components/WebCamWrapper'

let AllWrapper = ({slug, app}) =>{
    const params = useParams()
    const navigate =  useNavigate()
    if (slug === 'create'){
        return(
              <CreateRoomPage navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if( slug === 'join'){
        return(
              <RoomJoin navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if(slug ==='room'){
        return(
          <WebCamWrapper app={app} navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if (slug === ''){
        return(
            <CSHomePage app={app} navigate={(e) => {navigate(e)}} params={params}/>
            )}
    }

export {AllWrapper}