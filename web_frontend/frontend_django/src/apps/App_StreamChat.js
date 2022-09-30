import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import { streamchat_dir } from './Admin';

import {Chatroom} from '../React_StreamChat/components/Chatroom'

let StreamChat = () => {
    return (
        <Router>
            <Routes>
                <Route path={streamchat_dir} element={<Chatroom />}></Route>
            </Routes>
        </Router>
    );
}
export {StreamChat}
