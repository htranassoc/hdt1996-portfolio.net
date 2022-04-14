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
  let TO_DEBUG=1 //-------------------------------------- SET TO 1 TO TEST USING MULTIPLE OF SAME COMPONENTS
  let App_Dict={}
  let App_Ids=[]
  for(let app in apps)                        //produces __esmodules
  {
    for (let i in apps[app])                  //iterate through objects in each iteration
    { 
      if(typeof(apps[app][i])==="function")
      {
                                              
                                              //call key of iteration again to get isolated component object
        if(i==='Admin' && app !== "Admin.js"){console.log(i, 'Duplicate Admin Found',app)} 

        if (App_Dict[i] === undefined && TO_DEBUG ===0){App_Dict[i]=apps[app][i];App_Ids.push(i)}

        if (TO_DEBUG===1){ App_Dict[i]=apps[app][i] ;App_Ids.push(i)
        }
        
      }  // i is the name of the variable defined
    } 
  }; return {'Dict':App_Dict,'Ids':App_Ids}

}

const apps = importAll(require.context('./apps', false, /\.(js)$/));
let app_data= CreateDict(apps)
let App_Ids=app_data['Ids']
let App_Dict=app_data['Dict']
//console.log('\n\n',App_Dict,'\n\n')
const injected=importAll(require.context('./apps_injected', false, /\.(js)$/));
let inj_data= CreateDict(injected)
//let Inj_Ids=inj_data['Ids']
let Inj_Dict=inj_data['Dict']
//console.log('\n\n',Inj_Dict,'\n\n')
const comps=importAll(require.context('./Universal/components', false, /\.(js)$/));
let comp_data= CreateDict(comps)
//let Comp_Ids=comp_data['Ids']
let Comp_Dict=comp_data['Dict']
//console.log('\n\n',Comp_Dict,'\n\n')
const pages=importAll(require.context('./Universal/pages', false, /\.(js)$/));
let page_data= CreateDict(pages)
//let Page_Ids=page_data['Ids']
let Page_Dict=page_data['Dict']

//let Combined_Ids=App_Ids.concat(Comp_Ids).concat(Inj_Ids).concat(Page_Ids)
let Combined_Dict=Object.assign({},App_Dict,Comp_Dict,Inj_Dict,Page_Dict)


let renderComponent = (x,query,i) =>
{ 
  let Component = Combined_Dict[x]

  ReactDOM.render(
    <React.StrictMode>
      <Component Combined_Dict={Combined_Dict} App_Ids={App_Ids}/>
    </React.StrictMode>,
    query[i])
}



let x
for (x in Combined_Dict)                        // REMEMBER, IF WE GET MINIFIED/NOT DOM ERROR FROM REACT, CHECK VARIABLES HERE
{ 
  let query = document.querySelectorAll(`#${x}`)
  if (query.length === 1)
  { 
    renderComponent(x,query,0)
  }
  if (query.length > 1)
  {
    for(let i = 0; i < query.length; i++)
    {
      renderComponent(x,query,i)
    }
  }
}
export{importAll}
export{CreateDict}


