import React from 'react';
import ReactDOM from 'react-dom';

function importAll(dict) {
  let images = {};
  //console.log(dict.keys())
  dict.keys().map((item, index) => {return (images[item.replace('./', '')] = dict(item)); });
  return images;
}

const CreateDict = (apps) =>
{ 
  var TO_DEBUG=1 //-------------------------------------- SET TO 1 TO TEST USING MULTIPLE OF SAME COMPONENTS
  var App_Dict={}
  var App_Ids=[]
  for(var app in apps)                        //produces __esmodules
  {
    for (var i in apps[app])                  //iterate through objects in each iteration
    { 
      if(typeof(apps[app][i])==="function")
      {
                                              //console.log(apps[app][i], 'count: ', count)
                                              //call key of iteration again to get isolated component object
        if(i==='Admin' && app !== "Admin.js"){console.log(i, 'Duplicate Admin Found',app)} 
        else if (App_Dict[i] === undefined && TO_DEBUG ===0){App_Dict[i]=apps[app][i];App_Ids.push(i)}
        else if (TO_DEBUG===1){App_Dict[i]=apps[app][i];App_Ids.push(i)}
      }  // i is the name of the variable defined
    } 
  }; return {'Dict':App_Dict,'Ids':App_Ids}

}

const apps = importAll(require.context('./apps', false, /\.(js)$/));
var app_data= CreateDict(apps)
var App_Ids=app_data['Ids']
var App_Dict=app_data['Dict']


const injected=importAll(require.context('./apps_injected', false, /\.(js)$/));
var inj_data= CreateDict(injected)
var Inj_Ids=inj_data['Ids']
var Inj_Dict=inj_data['Dict']

const comps=importAll(require.context('./Universal/components', false, /\.(js)$/));
var comp_data= CreateDict(comps)
var Comp_Ids=comp_data['Ids']
var Comp_Dict=comp_data['Dict']

const pages=importAll(require.context('./Universal/pages', false, /\.(js)$/));
var page_data= CreateDict(pages)
var Page_Ids=page_data['Ids']
var Page_Dict=page_data['Dict']

var Combined_Ids=App_Ids.concat(Comp_Ids).concat(Inj_Ids).concat(Page_Ids)
var Combined_Dict=Object.assign({},App_Dict,Comp_Dict,Inj_Dict,Page_Dict)

//console.log(Combined_Dict)
var x

for (x in Combined_Dict)                        // REMEMBER, IF WE GET MINIFIED/NOT DOM ERROR FROM REACT, CHECK VARIABLES HERE
{ 
  if (document.getElementById(x) !== null)
  { 
    //console.log('Loading... ', x)
    let Component = Combined_Dict[x]

    ReactDOM.render(
      <React.StrictMode>
        <Component/>
      </React.StrictMode>,
      document.getElementById(x))
  }
}
export{importAll}
export{CreateDict}
export{App_Dict}
export{App_Ids}
export{Combined_Dict}
export{Combined_Ids}


