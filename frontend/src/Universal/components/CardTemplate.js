import React, {useEffect, useState} from 'react'
import '../css/CT_Template.css'

let Sizes = 
{
  "Full-Screen":{position:'fixed',width:'100%',height:'100%',top:'0px',left:'0px',bottom:'0px',right:'0px',margin:'auto'},
  "Viewport":{width:'100vw',height:'100vh'},
  "Parent":{width:'100%',height:'100%'},
  "Default":{width:'80em',height:'40em'}
}

const CardTemplate = 
({
    Template,Size,CT_Title,               // Setting
    Phone,Email,Address,                  // Contact
    Image,Description,                    // Poster
    l1,l2,l3,l4,i1,i2,i3,i4               // General
}) => 
{
  let [Dimension,setDimension]=useState(null)
  let [Type,setType]=useState(null)
  let determineFullSize = (value) =>
  {
    if(value === undefined){return alert(`No Value Passed | Value: ${value}`)}
    if(Object.keys(value).length>1)
    {
      let custom
      if(value[2] !== undefined || value[2] !== '')
      {
        custom={width:value[0],height:value[1],fontSize:value[2]}
      }
      else
      {
        custom={width:value[0],height:value[1]}
      }
      return setDimension(custom)
    }
    return setDimension(Sizes[value])
  }

  let determineTemplateType = (value) => {
    return setType(value)
  }
  useEffect(()=>{

    if(Template !== undefined){determineTemplateType(Template)}
    if(Size !== undefined){determineFullSize(Size)}


  },[Template,Size])
  return (
  <>
    {Type === 'Contact'?

      <div id={`UCT_${Type}`} style={Dimension}>
        <div id="UCT_Contact_Title"> {CT_Title}</div>
        <div id="UCT_Contact_Info">
          <div >
            <div ><div>Phone Number</div></div>
            <div ><div>Email</div></div>
            <div ><div>Address</div></div>
          </div>

          <div >
              <div ><div>{Phone}</div></div>
              <div ><div>{Email}</div></div>
              <div ><div>{Address}</div></div>
          </div>
        </div>
      </div>
    :null
    }

  {Type === 'Poster'?

    <div id = {`UCT_${Type}`} style={Dimension}>
      <div id="UCT_Poster_Image"><img src = {Image} alt=''></img></div>
      <div id="UCT_Poster_Title"> {CT_Title}</div>
      <div id="UCT_Poster_Description">
          {Description}
      </div>
    </div>
    :null
    }
  </>);
}

export {CardTemplate}

