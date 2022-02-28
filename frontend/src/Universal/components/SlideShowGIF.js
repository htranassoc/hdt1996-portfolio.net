import React from 'react'
import '../css/SlideShow.css'

const colors = ["#0088FE", "#00C49F", "#FFBB28"];
/* const delay = 2500; */

const SlideShowGIF = () => {

  
  const [index, setIndex] = React.useState(0);
  /* const timeoutRef = React.useRef(null); */

  return (
    <div className="slideshow">
      <div
        className="slideshowSlider"
        style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}
      >
        {colors.map((backgroundColor, index) => (
          <div
            className="slide"
            key={index}
            style={{ backgroundColor }}
          ></div>
        ))}
      </div>

      <div className="slideshowDots">
        {colors.map((_, idx) => (
          <div
            key={idx}
            className={`slideshowDot${index === idx ? " active" : ""}`}
            onClick={() => {
              setIndex(idx);
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export {SlideShowGIF}

