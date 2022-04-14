import React from 'react'
import {SlideShowGIF} from '../Universal/components/SlideShowGIF'
import './css/home.css'
import comment from '../Universal/images/comment.svg'

let Home= () =>{

  let docker = 
  `
  With  Docker Desktop on Windows, I utilize lightweight images to containerize my Django, NGINX, and Coturn servers.
  To streamline their usage, I use a docker-compose file which specifies their attached networks, volumes, environment variables, and binded host/container ports.
  With regards to volumes, I use named volumes for persisting data and unnamed volumes for container files to be updated immediately in host directory.
  `
  let python_django=
  `
  With Python-Django as my main back-end server, I utilize postgresql as my database, numerous models, front-end views (the current page you are reading from), and back-end views for various API requests.
  The first application I built on this project is the simple online store that uses server-side javascript to track cart updates, pending orders, and completed orders.
  The next application I developed is the main spotlight of this server. It is heavily integrated with ReactJS, allowing for native Django html pages to be injected with React components such as the current page you are viewing.
  Additionally, within React, I have built an application/component management script that allows multiple React Apps to be hosted efficiently on one node server.
  Please click on ReactJS for more details.
  `

  let nginx=
  `
  With NGINX, I established a proxy/reverse-proxy server that utilizes cors security, serves static and media file serving, and forwards requests to my internal servers.
  Necessary files from my host directory are transferred to the NGINX container using unnamed and named volumes.
  In my default.conf file, you will see numerous location blocks referencing to this container's varied directories for serving html, static, and media files. 
  Network-wise, to speed up client connection to my internal servers, I direct the reverse-proxy requests to my LAN ipv4 addresses inside my network.
  Behind NGINX, I have node servers, coturn servers, and uwsgi as proxy to Python-Django. Regarding security, I utilize cors headers in my location blocks and use CA SSL certification in all of my servers.
  
  `
  

  let reactjs=
  `
  With ReactJS, I scripted an interface that lists the five main React applications I host on my website: NotesApp, Spotify, SocketApp, VideoStreaming, and MineSweeper.
  Most notable about this project is the way the components are loaded using the apps, apps_injected, and Injected directories. First, the index.js file maps the names and javascript objects of these directories to a dictionary object. 
  This dictionary variable is then exported to the admin.js (in apps directory) that renders the menu. Upon choosing of a React app, the dictionary key of that app is called against the dictionary object to execute the Javascript object stored 
  which would then import all of the dependencies and subsequent scripts imported from the React_* directories, which are dedicated folders to specific apps.
  `

  let nodejs=
  `
  With NodeJS, I utilize the express() and https modules to create servers for starting and maintaining websocket, socket.io, and PeerJS connections. These servers exist in my network, and I use NGINX to proxy to these
  servers with LAN ipv4 as mentioned in the NGINX description. Within my SocketApp that is listed in my React Apps, I integrated chatting, fileSharing, and videoStreaming in one package using extensive event handlers.
  For PeerJS videochatting specifically, I set up my own stun and turn servers within my Ubuntu virtual machine, which will be described in the Virtual Machine section.
  `

  let virtual_machine=
  `
  With a virtual_machine, I set up an Ubuntu operating system and installed/configured the coturn apk package for my VideoStreaming feature to work properly. I initially tested the stun/turn server functionality within a docker
  container utilizing the official coturn image. However, the package was not compatible with Docker Desktop on windows, causing connection to fail due to the container's inability to bind and listen to my host machine's ipv4/port even on the network_mode:host setting.
  Using Oracle's VirtualBox with bridge mode setting and Ubuntu, my stun and turn servers were properly connected as ice servers by PeerJS for devices behind Network Address Translation networks.
  `


  
  let renderUsageDescription = (value) => 
  {
    let element = document.getElementById("Injected_FD_Text")
    
    if(value === 'Docker'){console.log('Changed');return element.innerHTML = docker}
    if(value === 'NGINX'){console.log('Changed');return element.innerHTML = nginx}
    if(value === 'Python-Django'){console.log('Changed');return element.innerHTML = python_django}
    if(value === 'ReactJS'){console.log('Changed');return element.innerHTML = reactjs}
    if(value === 'NodeJS'){console.log('Changed');return element.innerHTML = nodejs}
    if(value === 'Virtual Machine'){console.log('Changed');return element.innerHTML = virtual_machine} 

  }
  return (
    <div className="Injected_Home_Container">
{/*         <div style={{position:'absolute',width:'100%',zIndex:5}}><Navigation/> </div> */}
        <div className = "Injected_Intro_Column">
          <div className="Injected_Feature_Block_Row">
              <div className="Injected_Feature_Left_Row">
                  <p> 
                    This application makes use of the following platforms listed on the right.
                  </p>
                  <p>
                    Please click on each to view the descriptions:
                  </p>
              </div>

              <div className="Injected_Feature_Right_Row">
                  <button onClick={(e) => {renderUsageDescription(e.target.innerHTML)}}>Docker</button>
                  <button onClick={(e) => {renderUsageDescription(e.target.innerHTML)}}>NGINX</button>
                  <button onClick={(e) => {renderUsageDescription(e.target.innerHTML)}}>Python-Django</button>
                  <button onClick={(e) => {renderUsageDescription(e.target.innerHTML)}}>ReactJS</button>
                  <button onClick={(e) => {renderUsageDescription(e.target.innerHTML)}}>NodeJS</button>
                  <button onClick={(e) => {renderUsageDescription(e.target.innerHTML)}}>Virtual Machine</button>
              </div>
          </div>
          <div id = "Injected_FeatureDetail" className="Injected_FeatureDetail">

            <img id="Injected_FD_Comment" className="Injected_FD_Comment" src = {comment} alt=''></img>
            <div id="Injected_FD_Text" className="Injected_FD_Text"></div>
          </div>
        </div>
        <div id="Injected_SlideShowGIF"><SlideShowGIF/></div> 
    </div>
  );
}

export {Home}
