import React, {useState, useEffect} from 'react'
import '../Universal/css/Admin.css'
import { getToken } from '../Universal/js/utils'
import 
{BrowserRouter as Router, Link} from "react-router-dom"
import {Navigation} from '../Universal/components/Navigation'

let port = ":8001"
let react_port = ':3000'
let deploy_status =true
let host = '192.168.1.200'
let domain
let home_dir

let regex=/([a-zA-Z_]+)\//
let port_rgx = new RegExp(`${port}`)
let react_port_rgx = new RegExp(`${react_port}`)

let preslug='/react/'
let notes_dir = preslug.concat('Notes/'), 
    msweep_dir = preslug.concat('MineSweeper/'), 
    web_dir = preslug.concat('WebsiteTY/'), 
    class_dir = preslug.concat('Template_Class/'),
    spotify_dir=preslug.concat('Spotify/'),
    videostream_dir = preslug.concat('VideoStream/'),
    streamchat_dir=preslug.concat('StreamChat/'),
    videochat_dir = preslug.concat('VideoChat/'),
    test_dir = preslug.concat('Injection/'),
    forum_dir = preslug.concat('Forum/'),
    rooms_dir = preslug.concat('Rooms/'),
    login_dir = preslug.concat('Login/'),
    dashboard_dir = preslug.concat('Dashboard/')

if(deploy_status === true)
{
  domain = 'https://hdt1996-portfolio.net'
  home_dir = 'https://hdt1996-portfolio.net/'
}
else
{
  domain = `http://${host}`
  home_dir = `http://${host}${port}/`
}

let getFillerWidth = () =>
{
  let dimension
  let pj_main = document.querySelector(".pj_main")
  if(pj_main.classList.contains("pj_hidden"))
  {
    pj_main.classList.remove('pj_hidden')
    dimension = pj_main.getBoundingClientRect()
    pj_main.classList.add('pj_hidden')
  }
  else{
    dimension = pj_main.getBoundingClientRect()
  }
  let window_width = window.screen.width
  return ((window_width - dimension.width)/2)
}

let getScrollbarWidth = () =>
{
  let scrollbarWidth
  document.body.style.overflow="hidden"
  let width = document.body.getBoundingClientRect()
  document.body.style.overflowY="scroll"
  let width_less_scroll= document.body.getBoundingClientRect()
  scrollbarWidth = width.width - width_less_scroll.width
  
  return scrollbarWidth;
}

let resizeHandler = () => 
{
  filler_width = getFillerWidth(); scroll_size = getScrollbarWidth()
}

let getSlug = (URL) => 
{
  let slug
  let port_match = port_rgx.exec(URL)
  let react_port_match = react_port_rgx.exec(URL)
  if(deploy_status === true){slug = URL.replace(/https?:\/\/[a-zA-Z.0-9-]+\/[a-zA-Z]+\//,'')}

  if((port_match !== null && port !== '') || (react_port_match !== null && react_port !== ''))
  {
    slug = URL.replace(/https?:\/\/[a-zA-Z.0-9-]+:[\d]+\/[a-zA-Z]+\//,'')
    //console.log(slug)
  }

  if(slug !== '')
  {
    let App_Match = regex.exec(slug)
    slug=App_Match[1]
    //console.log(slug)
  }
  return slug
}


let scroll_size
let filler_width
let Admin= ({App_Ids,Combined_Dict})=>
{
  let admin_index=App_Ids.indexOf('Admin')
  if (admin_index > -1){App_Ids.splice(admin_index,1)}

  let URL = window.location.href
  let TabSession
  let [AppsActive,setAppsActive]=useState({})
  let [UserData,setUserData] = useState(null)
  let [CheckAuth,setCheckAuth] = useState(null)
  let Slug = getSlug(URL)
 

  let Component = Combined_Dict[Slug]
  let Select = Combined_Dict['AppSelect'];
  let Header = Combined_Dict['AdminHeader'];

  let ChangeApp = (app) =>
  {
    TabSession=(Number(localStorage.getItem('App-Session')))
    let App_Data=JSON.parse(localStorage.getItem('Apps-Active'))

    if(App_Data===null){App_Data={}}
    if(!App_Data[[app]]){App_Data[[app]]=1;}
    else{App_Data[[app]]+=1}
    TabSession+=1

    localStorage.setItem('App-Session',TabSession)
    localStorage.setItem('Apps-Active',JSON.stringify(App_Data))

    setAppsActive(App_Data)
  }

  let ResetApp = (app) =>
  {   
    TabSession=(Number(localStorage.getItem('App-Session')))
    let App_Data=JSON.parse(localStorage.getItem('Apps-Active'))
    if(App_Data === null){App_Data={}}

    if(TabSession > 0) 
    {    
      TabSession=TabSession - 1
      App_Data[[app]]-=1
    }

    else{
      App_Data[[app]] = 0
    }

    localStorage.setItem('App-Session',TabSession)
    localStorage.setItem('Apps-Active',JSON.stringify(App_Data))
    
    setAppsActive(App_Data)
  }


  let windowEventHandler= () => {
    if(Slug !== '')
    {
      window.onload = () => 
      {
        if(window.performance.getEntriesByType("navigation")[0].type !=='reload')
        {ChangeApp(Slug)}

        console.log('\n\n Same Tab Reload')
      }

      window.onbeforeunload = () => 
      {
        if(window.performance.getEntriesByType("navigation")[0].type !== 'reload')
        {ResetApp(Slug)}
        console.log('\n\n Same Tab Closed \n\n')
      }
    }
  }

  let getCSRF = async () => {
    let response = await fetch(`${domain}/api/csrf_token/`)
    let data = await response.json()
    console.log(data)
  }
  let getUserData = async () => {
    let response = await fetch(`${domain}/api/getUserData/`)
    let data = await response.json()
    setUserData(data)
  }

  let getAuth = async () => {
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
  }
  useEffect(async () =>
  { 
    filler_width = getFillerWidth()
    scroll_size = getScrollbarWidth()
    await getCSRF()
    await getAuth()
    window.addEventListener('resize',() => resizeHandler())
    windowEventHandler()
    return window.removeEventListener('resize',resizeHandler)
  },[])

  useEffect(() => 
  {
    console.log('Re-Rendered with Auth Vars', CheckAuth,UserData)
  }
  ,[CheckAuth, UserData])

  return (
      <div className="Admin_Container">
        <div id="Admin_Navigation"><Navigation CheckAuth = {CheckAuth} UserData = {UserData} setCheckAuth={(e) => {setCheckAuth(e)}}/></div>
        
          {
          Slug === ""?
          <>
          <Header/>
          <div className="Admin_Menu_Container">
            <div className="Admin_Menu_Header"><strong>Choose Below</strong></div>
            
            <div className="Admin_Menu_">

              <Router>
              {App_Ids.map
                (
                  (app,index)=>
                    (
                    <Select key={index} app={app} onClick={()=>{ChangeApp(app)}} Destination={preslug.concat(app,'/')}/>
                    )
                )
              }
              </Router>

            </div>
          </div>
          </>
        :
          <div className="Admin_Selected_Container">
            <Router> 
              <div className="Admin_Reset_Wrapper">
                <div className = "Admin_App_Title">{Slug}</div>
                <div className="Admin_Reset">
                  <Link id = "Admin_Close_Btn"  to = '/react/' onClick={()=>{ResetApp(Slug)}}>Close</Link>
                </div>
              </div>
            </Router> 
            <Component UserData = {UserData} ResetApp={()=>{ResetApp(Slug)}}></Component>
          </div>
          }
      </div>
  );

}
export {Admin}
export {notes_dir, 
        web_dir,
        home_dir,
        msweep_dir,
        class_dir,
        spotify_dir,
        videostream_dir,
        streamchat_dir,
        domain,
        deploy_status,
        port,
        react_port,
        port_rgx,
        react_port_rgx,
        scroll_size,
        filler_width,
        test_dir,
        videochat_dir,
        forum_dir,
        rooms_dir,
        login_dir,
        dashboard_dir
}

