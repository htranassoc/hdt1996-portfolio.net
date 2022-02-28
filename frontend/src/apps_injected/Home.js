import 
{
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom"

import React from 'react'
import {SlideShowGIF} from '../Universal/components/SlideShowGIF'
import '../Universal/css/SlideShow.css'


//   regex    /              /g
// g means global to find all instances - placed outside outer slash; can also place other flags
// | means or statement
// using () isolates from rest; means can do /(jack|jill)basic    / to find anything like jackbasic or jillbasic
// + sign means 0 or 1 times
// * means 1 or more times
// can use {} like 2,6 to specify number of occurrences, means 2 to 6 times in this case
// \ use backslash for escape \d means any digit \w means any word character
// can use [] bracket to define custom character sets such as [A-Z] or [ABC]; use ^ within bracket to negate set
// $ means end of string

let Home= () =>{

  return (
    <Router>
    <div>
      <div>
        TEST ..........................................................................................
        <Routes>
          <Route path="" element={<SlideShowGIF/>}>
          </Route>
        </Routes>
      </div>

    </div>
  </Router>
  );
}

export {Home}
