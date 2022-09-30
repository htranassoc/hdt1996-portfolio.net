import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import { videochat_dir } from './Admin';

import {WebCamWrapper} from '../React_StreamChat/components/WebCamWrapper'

let VideoChat = () => {
    return (
        <Router>
            <Routes>
                <Route path={`${videochat_dir}:id/`} element={<WebCamWrapper/>}></Route>
            </Routes>
        </Router>
    );
}
export {VideoChat}
