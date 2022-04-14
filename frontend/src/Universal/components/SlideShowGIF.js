import React from 'react'
import '../css/SlideShow.css'
import img_1 from '../../Universal/images/SS_React_Notes.PNG'
import img_2 from '../../Universal/images/SS_React_Minesweeper.PNG'
import img_3 from '../../Universal/images/SS_React_Spotify.PNG'
import img_4 from '../../Universal/images/SS_React_Chatroom.PNG'


const colors = ["black","black","black","black"];
/* const delay = 2500; */
const app_imgs = [img_1,img_2,img_3,img_4]
const SlideShowGIF = () => {

  
  const [index, setIndex] = React.useState(0);
  /* const timeoutRef = React.useRef(null); */

  return (
    <div className="Universal_slideshow">
        <div
          className="Universal_slideshowSlider"
          style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
          >
          {
            colors.map((color, index) => 
            {

              return (
              <div className="Universal_slideContainer" key={index} >
                <div className="Universal_slide" style={{backgroundColor:`${color}` }}>
                  <img id="US_app_img" src = {app_imgs[index]} alt=''></img>
                </div>

              </div>
            )}
          )}
        </div>

        <div className="Universal_slideshowDots">
          {
            colors.map((_, idx) => 
            (
              <div
                key={idx}
                className={`Universal_slideshowDot Universal_${index=== idx ? "active" : ""}`}
                onClick={() => {setIndex(idx);}}
              ></div>
            )
          )}
        </div>
    </div>
  );
}

export {SlideShowGIF}

