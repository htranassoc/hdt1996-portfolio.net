import React from 'react'
import {SlideShowGIF} from '../Universal/components/SlideShowGIF'
import './css/tester.css'
import comment from '../Universal/images/comment.svg'

let Tester= () =>{
  return (
    <div className="Test_Main Test_Inner_Row">

      <div className="Test_Inner_Col">
        <div className="Test_Div"></div>
        <div className="Test_Div"></div>
      </div>

      <div className="Test_Inner_Col">
        <div className="Test_Div"></div>
        <div className="Test_Div"></div>
      </div>

      <div className="Test_Inner_Col">
        <div className="Test_Div">aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
        <div className="Test_Div"></div>
      </div>

    </div>
  );
}

export {Tester}
