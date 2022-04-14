import {Main} from '../../React_Dashboard/components/Main'
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'


let Wrapper = ({UserData}) => {
    const params = useParams()
    const navigate =  useNavigate()
    console.log(UserData)

    return(
        <Main UserData = {UserData} navigate = {(e) => {navigate(e)}}params={params}/>
    )
}
export {Wrapper }

