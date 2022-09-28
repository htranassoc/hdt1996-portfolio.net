import React from 'react'
import '../css/Admin.css'
import {home_dir} from '../../apps/Admin'

const AdminHeader = () => {
    return (
        <div className="Admin_Title_Container">
            <div className="Admin_TC_Section">
                <div className="Admin_TC_1">
                    <div id="Admin_TC_1A">Application Menu</div>
                </div>

                <div className="Admin_TC_2" >
                    <a href={home_dir} id="Admin_TC_2a">Back to Home</a>
                </div>
            </div>
        </div>
    )
}

export{AdminHeader}
