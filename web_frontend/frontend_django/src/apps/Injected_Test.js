import {Home} from '../apps_injected/Home'
import { Tester } from '../apps_injected/Test';
import React  from 'react'
import {
    Route,
    BrowserRouter as Router,
    Routes,
} from "react-router-dom";
import {test_dir} from './Admin'

let Injection = () => {

    return (
        <Router>
            <Routes>
                <Route path={test_dir} element={<Tester />}></Route>
            </Routes>
        </Router>
    )
}

export {Injection}