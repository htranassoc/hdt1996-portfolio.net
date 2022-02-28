import React, {useState, useEffect} from 'react'
import {Combined_Dict, App_Ids} from '../index';
import '../Universal/css/Admin.css'
import {Link} from 'react-router-dom'

import 
{BrowserRouter as Router,} from "react-router-dom"

let port = ':8001'
let debug_port = ':3000'
let domain
let home_dir
let Slug
let deploy_status = false;
/* NOTE: can use component argument in props to combine two react elements such as button and link. Works in class based components so far. */

if(deploy_status === true)
{
  domain = 'https://hdt1996-portfolio.me'
  home_dir = 'https://hdt1996-portfolio.me/'
  port = ''
}
else
{
  domain = 'http://192.168.7.237'
  home_dir = `http://192.168.7.237${port}/`
}

let testslug = true
let preslug='/react/'

let notes_dir = preslug.concat('NotesApp','/'), 
    msweep_dir = preslug.concat('MineSweeper','/'), 
    web_dir = preslug.concat('WebsiteTY','/'), 
    class_dir = preslug.concat('Template_Class','/'),
    ContentSharing_dir=preslug.concat('ContentSharing','/'),
    video_dir = preslug.concat('VideoApp','/'),
    socket_dir=preslug.concat('SocketApp','/')


let getScrollbarWidth = () =>
  {

    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer)
  
    const inner = document.createElement('div');
    outer.appendChild(inner);
  
    const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
    document.body.removeChild(outer)
    return scrollbarWidth;
  
  }
let scroll_size = getScrollbarWidth()

let Admin= ()=>{
  let admin_index=App_Ids.indexOf('Admin')
  if (admin_index > -1){App_Ids.splice(admin_index,1)}

  let URL = window.location.href
  let TabSession
  let [AppsActive,setAppsActive]=useState({})

  let port_rgx = new RegExp(`${port}`)
  let port_match = port_rgx.exec(URL)

  if(deploy_status === true){Slug = URL.replace(/https?:\/\/[a-zA-Z.0-9-]+\/[a-zA-Z]+\//,'')}
  else
  {
    if((port_match !== null && port !== '') || debug_port)
      {
        Slug = URL.replace(/https?:\/\/[a-zA-Z.0-9-]+:[\d]+\/[a-zA-Z]+\//,'')
      }
    else
    {
      Slug = URL.replace(/https?:\/\/[a-zA-Z.0-9-]+\/[a-zA-Z]+\//,'')
    }
  }
 
  var regex=/([a-zA-Z_]+)\//

  if(Slug !== ''){
    var App_Match = regex.exec(Slug)
    Slug=App_Match[1]
    }


  let Component = Combined_Dict[Slug]
  let Select = Combined_Dict['AppSelect'];
  let Header = Combined_Dict['AdminHeader'];

  let ChangeApp = (app) =>
  {
    TabSession=(Number(localStorage.getItem('App-Session')))
    let App_Data=JSON.parse(localStorage.getItem('Apps-Active'))

    if(App_Data===null){App_Data={}}
    if(!App_Data[[app]]){App_Data[[app]]=1; console.log('Added')}
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

  useEffect(() =>
  { 
    if(Slug !== '')
    {
      window.onload = () => {
        if(window.performance.getEntriesByType("navigation")[0].type !=='reload')
        {console.log(window.performance.getEntriesByType("navigation"));ChangeApp(Slug)}}
      window.onbeforeunload = () => {
        if(window.performance.getEntriesByType("navigation")[0].type !== 'reload')
        {alert(window.performance.getEntriesByType("navigation"));ResetApp(Slug)}}
    }


    return 0
  }
  ,)

  return (
    <div className="AdminContainer">
      <div className='Admin_Intro'>
          < Header />
      </div>
      {Slug === ""?
        <div className="AppMenuContainer">
          <div className="AppMenuHeader"><strong>Apps</strong></div>
          
          <div className="AppMenu">

            <Router>
            {App_Ids.map
              (
                (app,index)=>
                  (
                  <Select key={index} app={app} to={preslug.concat(app,'/')} ChangeApp={()=>{ChangeApp(app)}}/>
                  )
              )
            }
            </Router>

          </div>
        </div>:
        <div className="Selected_App_Container">
          <Router> 
            <div className="Reset_Wrapper">
              <div className="Admin_Reset">
                <Link id = "Close_Button" to = '/react/' onClick={()=>{ResetApp(Slug)}}>Close</Link>
              </div>
            </div>
          </Router> 
        <Component ResetApp={()=>{ResetApp(Slug)}}></Component>
        </div>}
    </div>

  );

}
console.log(scroll_size)
export {Admin}
export {notes_dir, 
        web_dir,
        home_dir,
        msweep_dir,
        class_dir,
        ContentSharing_dir,
        video_dir,
        socket_dir,
        domain,
        deploy_status,
        testslug,
        port,
        debug_port,
        scroll_size}

