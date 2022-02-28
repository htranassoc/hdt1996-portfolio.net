import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../css/RoomCss.css'
import {Room} from './Room'
import {CSHomePage} from './CSHomePage'
import {CreateRoomPage} from './CreateRoomPage'
import {RoomJoin} from './RoomJoin'

let AllWrapper = ({slug}) =>{
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
          <Room navigate={(e) => {navigate(e)}} params={params}/>
        )}
    else if (slug === ''){
        return(
            <CSHomePage navigate={(e) => {navigate(e)}} params={params}></CSHomePage>
            )}
    }

export {AllWrapper}