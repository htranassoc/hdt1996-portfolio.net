import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";

import { VideoWrapper } from '../React_VideoApp/components/VideoWrapper';
import {video_dir} from './Admin'

let VideoApp = () => {
    return (
        <Router>
            <Routes>
                <Route path={video_dir} element={<VideoWrapper slug = ''/>}></Route>
                <Route path={`${video_dir}player/:id/`} element={<VideoWrapper slug = 'player'/>}></Route>
            </Routes>
        </Router>
    );
}
export {VideoApp}
