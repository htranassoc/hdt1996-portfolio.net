import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import {forum_dir} from './Admin';
import {Home} from '../React_Forum/components/Home'

let Forum = () => {
    return (
        <Router>
            <Routes>
                <Route path={forum_dir} element = {<Home/>}></Route>
            </Routes>
        </Router>
    );
}
export {Forum}
