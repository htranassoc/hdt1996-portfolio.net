import React, {useState, useEffect} from 'react'
import {Combined_Dict, App_Ids} from '../index';
import '../Universal/css/Admin.css'
import {Link} from 'react-router-dom'

import 
{BrowserRouter as Router,} from "react-router-dom"

var deploy_status = true
/* NOTE: can use component argument in props to combine two react elements such as button and link. Works in class based components so far. */

if(deploy_status === true)
{
  var domain = 'https://hdt1996-portfolio.me'
  var home_dir = 'https://hdt1996-portfolio.me:8001/'
}
else
{
  var home_dir = 'http://192.168.0.37:8001/'
  var domain = 'http://192.168.0.37'
}

var testslug = true
var preslug='/react/'

var notes_dir = preslug.concat('NotesApp','/'), 
    msweep_dir = preslug.concat('MineSweeper','/'), 
    web_dir = preslug.concat('WebsiteTY','/'), 
    class_dir = preslug.concat('Template_Class','/'),
    ContentSharing_dir=preslug.concat('ContentSharing','/'),
    video_dir = preslug.concat('VideoApp','/'),
    socket_dir=preslug.concat('SocketApp','/')
let Admin= ()=>{
  var admin_index=App_Ids.indexOf('Admin')
  if (admin_index > -1){App_Ids.splice(admin_index,1)}

  let URL = window.location.href
  let [TabSession,setTabSession]=useState(null)
  let [AppsActive]=useState("")
  let Slug = URL.replace(/https?:\/\/[a-zA-Z.0-9-]+:[\d]+\/[a-zA-Z]+\//,'')
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
    AppsActive=localStorage.getItem('Apps-Active')

    if(String(AppsActive)==="null"){AppsActive={}}
    else{AppsActive=JSON.parse(localStorage.getItem('Apps-Active'))}

    TabSession=Number(TabSession)+1
    if(AppsActive[[app]]=== undefined || String(AppsActive[[app]]) === "null"){AppsActive[[app]]=Number(1)}
    else{AppsActive[[app]]+=1}
    localStorage.setItem('App-Session',TabSession)
    localStorage.setItem('Apps-Active',JSON.stringify(AppsActive))
    setTabSession(TabSession)
  }

  let ResetApp = (app) =>
  {   
    TabSession=(Number(localStorage.getItem('App-Session')))

    if(TabSession >0){AppsActive=JSON.parse(localStorage.getItem('Apps-Active'))

    TabSession=Number(TabSession)-1
    AppsActive[[app]]-=1

    localStorage.setItem('App-Session',TabSession)
    localStorage.setItem('Apps-Active',JSON.stringify(AppsActive))
    }
    setTabSession(TabSession)
  }

  useEffect(() =>
  { //Side Effect: data from setVariable from functions readily available to use in useEffect upon each trigger of useEffect
    if(Slug !== '')
    {
    window.onload = () => {
      if(window.performance.getEntriesByType("navigation")[0].type !=='reload')
      {ChangeApp(Slug)}}
    window.onbeforeunload = () => {
      if(window.performance.getEntriesByType("navigation")[0].type !== 'reload')
      {ResetApp(Slug)}}
    };

    return 0
  } //useEffect always triggered since link leads to new page when TabSession is set
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
        <div className="container2">
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
        testslug}

