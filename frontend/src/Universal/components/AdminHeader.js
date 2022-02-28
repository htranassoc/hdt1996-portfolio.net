import React from 'react'
import '../css/Admin.css'
import {home_dir} from '../../apps/Admin'

const AdminHeader = () => {
    return (
        <div className="Admin_Title_Container">
            <div className='Admin_Title_Container1'>
                <div className="Box1">Welcome to Our Apps</div>
            </div>

            <a className="Home_Button" href={home_dir}>
                <div className='Admin_Title_Container2'>
                    <div className="Box3">Back to Home</div>
                </div>
            </a>
        </div>
    )
}

export{AdminHeader}
