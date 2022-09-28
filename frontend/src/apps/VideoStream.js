import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";

import { VideoWrapper } from '../React_VideoStream/components/VideoWrapper';
import {videostream_dir} from './Admin'

let VideoStream = () => {
    return (
        <Router>
            <Routes>
                <Route path={videostream_dir} element={<VideoWrapper slug = ''/>}></Route>
                <Route path={`${videostream_dir}player/:id/`} element={<VideoWrapper slug = 'player'/>}></Route>
            </Routes>
        </Router>
    );
}
export {VideoStream}
