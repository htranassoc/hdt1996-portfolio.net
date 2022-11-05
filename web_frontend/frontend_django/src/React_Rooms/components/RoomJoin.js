import React from 'react'
import { useNavigate} from 'react-router-dom'
import {rooms_dir,domain} from '../../apps/Admin'
import '../css/Rooms.css'

let RoomJoin = () =>{

  let submit_code=0
  let submit_status=0
  let navigate = useNavigate()
  let update_input = (t) => {
    submit_status=0
    submit_code = t.target.value
  }
  let submit= async (submit_code) => {
    let requestOptions={
      method: 'POST',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({
          code: submit_code,
      }),
    };

    let response = await fetch(`${domain}/api/react/rooms/join/`,requestOptions)
    let data = await response.json()
    let element = document.getElementById('codesubmission')

    if(submit_status===1){
      console.log('Entering Room')
      navigate(rooms_dir.concat('room/',data.JoinCode,'/'))
    }
    if(data['Room Not Found']){
      let element = document.getElementById('codesubmission')
      element.placeholder='Wrong Code: Try Again'
      element.classList.add('WrongCode')
      element.value=''}

     else{
      submit_status=1
      element.value = `You have picked ........ Room ${data.JoinCode} ........ Continue?`
    } 
  }

    return(
        <div className="Rooms_Main">
          <div>
            <input id = 'codesubmission' onChange={(t) => {update_input(t)}} placeholder = 'Insert Room Code'></input>
            <input id = 'submit' type="submit" onClick={()=> {submit(submit_code)}}></input>
          </div>
        </div>
        )
  }

export {RoomJoin}