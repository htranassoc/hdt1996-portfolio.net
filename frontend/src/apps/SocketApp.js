import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import { socket_dir } from './Admin';

import {Home} from '../React_SocketApp/components/Home'
import {VideoChatWrapper} from '../React_SocketApp/components/VideoChatWrapper'

let SocketApp = () => {
    return (
        <Router>
            <Routes>
                <Route path={socket_dir} element={<Home />}></Route>
                <Route path={`${socket_dir}Video/:id/`} element={<VideoChatWrapper/>}></Route>
            </Routes>
        </Router>
    );
}
export {SocketApp}
