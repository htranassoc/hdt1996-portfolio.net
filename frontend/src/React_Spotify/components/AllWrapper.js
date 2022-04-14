import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {Room} from './Room'
import {CSHomePage} from './CSHomePage'
import {CreateRoomPage} from './CreateRoomPage'
import {RoomJoin} from './RoomJoin'

let AllWrapper = ({slug, app}) =>{
    const params = useParams()
    const navigate =  useNavigate()
    if (slug === 'create'){
        return(
              <CreateRoomPage app={app} navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if( slug === 'join'){
        return(
              <RoomJoin app={app} navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if(slug ==='room'){
        return(
          <Room app={app} navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if (slug === ''){
        return(
            <CSHomePage app={app} navigate={(e) => {navigate(e)}} params={params}></CSHomePage>
            )}
    }

export {AllWrapper}