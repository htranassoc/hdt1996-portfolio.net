import { Navbar, Nav, Form, FormControl, Button,Dropdown} from "react-bootstrap";
import React, {useEffect, useState} from 'react'
import { domain } from "../../apps/Admin";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/Navigation.css'
import {Main} from '../../React_Login/components/Main'
import uptick from '../../Universal/images/Up_Tick.svg'
import empty_profile_pic from '../../Universal/images/Empty_Profile_Pic.svg'

const Navigation = ({CheckAuth,setCheckAuth,UserData}) => {
  
  let toggle = false
  if(CheckAuth === undefined && setCheckAuth === undefined && UserData === undefined){
    CheckAuth = null;
    setCheckAuth = null;
    UserData = null;
  }
  let renderLogin = (bool) => {
    let element = document.querySelector("#Navigation_User_Menu")
    if(bool === true){
      element.classList.add("Navigation_User_Menu_Hidden")
      return setStatusLogin(true)
    }
    element.classList.remove("Navigation_User_Menu_Hidden")
    return setStatusLogin(false) 
  }

  let renderProfile = () => {

    if(CheckAuth === false)
    {
      return (<button id="Navigation_Sign_In" onClick = {() => {renderLogin(true)}}>Sign In</button>)
    }

    if(UserData !== null)
    {
      let element = document.querySelector("#Navigation_User_Menu")
      element.style.flex=.3;
      let user_data = UserData.user_data;
      if(user_data.profile_pic === null){
        console.log('\n\n Null \n\n')
        user_data.profile_pic = empty_profile_pic
      }

      return (
        <div className="Navigation_Profile_Header Navigation_Inner_Row">
          <div id="NPH_IMG">
            <img onClick = {() => {console.log('Clicked'); window.location.href=`${domain}${user_data.profile_pic}`}} src = {`${domain}${user_data.profile_pic}`}></img>
          </div>
          <div id="NPH_Name" className="Navigation_Inner_Col">
            <div className="Navigation_Inner_Row">
              <div id="NPHN_User">{UserData.username}</div>
            </div> 
            <div className=" Navigation_Inner_Row">
              <div id="NPHN_Label">Ranking</div>
              <div id="NPHN_Data">1000</div>
            </div>
          </div>
          <div id="NPH_Dashboard">My Dashboard</div>
        </div>
      )
    }
  }

  let [StatusLogin,setStatusLogin] = useState(false)
  
  let handleNavCreateElement = () => {
    let element = document.querySelector(".Navigation_Login_Wrapper")
    element.style.width="100%"
    element.style.height="90em"
    element.style.fontSize="1.1em"
    element.style.backgroundColor="black"
    element.style.top="4.5em"
  }



/*   let getUserData = async () => {
    let response = await fetch(`${domain}/api/getUserData/`)
    let data = await response.json()
    setUserData(data)
  } */

  let authenticate = async () => 
  {
    renderLogin(false)
    setCheckAuth(true)
    location.reload()
  }


  useEffect(() =>
  {
    let element = document.querySelector('#Navigation_Toggle_Label')
    element.addEventListener('click', () => 
    {
      let menu = document.querySelector('#Navigation_D_Menu')
      if(menu !== null)
      {
        menu.style = ''
      }
      if(toggle === true)
      {
          return toggle = false
      }
      return toggle = true

    }) 
  //console.log('CheckAuth',CheckAuth,'\n','StatusLogin',StatusLogin,'UserData',UserData)
  },[StatusLogin])


/*   useEffect(async () =>
  {
    let response = await fetch(`${domain}/api/authenticated/`)
    let data = await response.json()
    if(data['Success'])
    {
      console.log('Success')
      setCheckAuth(true)
      await getUserData()
    }
    if(data['Auth_Error'])
    {
      setCheckAuth(false)
    }

  },[])
 */

    return (
      <div className="Navigation_Wrapper">
        <Navbar bg="dark" variant="dark" className = "Navigation_Main Navigation_Inner_Row" >
          <Nav className="Navigation_Main_Sub" id = "Navigation_Header" >
            <Nav.Link id= 'Navigation_H_Link' href="/" >Home</Nav.Link>
            <Nav.Link id= 'Navigation_H_Link'>Resume</Nav.Link>
            <Dropdown id = "Navigation_H_Link" >
              <Dropdown.Toggle id = "Navigation_Toggle_Label" variant="secondary" >
                Menu
              </Dropdown.Toggle>

              <Dropdown.Menu className = "Navigation_D_Menu">
                <Dropdown.Item id = "Navigation_D_Item"href="/react/">App Menu</Dropdown.Item>
                <Dropdown.Item id = "Navigation_D_Item" href="/react/Notes/">Notes</Dropdown.Item>
                <Dropdown.Item id = "Navigation_D_Item" href="/react/StreamChat/">StreamChat</Dropdown.Item>
                <Dropdown.Item id = "Navigation_D_Item" href="/react/VideoChat/1">VideoChat</Dropdown.Item>
                <Dropdown.Item id = "Navigation_D_Item" href="/react/Spotify/">Spotify</Dropdown.Item>
                <Dropdown.Item id = "Navigation_D_Item" href="/react/VideoStream/">VideoStream</Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>
          </Nav>
          <Form className="Navigation_Main_Sub Navigation_Inner_Row" id = "Navigation_Form" >
            <FormControl
              type="text"
              placeholder="Search"
              className="mr-sm-2"
              id = "Navigation_Search_Input"
            />
            <Button  variant="outline-info" id = "Navigation_Form_Button">
              Search
            </Button>
          </Form>

          <div className="Navigation_Main_Sub" id="Navigation_User_Menu">

            {StatusLogin === true?
              <div className="Navigation_Login_Wrapper">
                <div className="Navigation_Login_Main" >
                  <Main handleNavCreateElement = {() => {handleNavCreateElement()}} authenticate = {(data) => {authenticate(data)}}/>

                </div>
                <div id="Navigation_User-Menu_Close">
                    <img onClick = {() => {renderLogin(false)}} src={uptick}></img>
                  </div>
              </div>
            :
              <>{CheckAuth !== null?renderProfile():null}</>
            }
          </div>
          
        {/* <button id="Navigation_Sign_In" onClick = {() => {renderLogin(true)}}>Sign In</button> */}
        </Navbar>
      </div>
    )
}

export{Navigation}