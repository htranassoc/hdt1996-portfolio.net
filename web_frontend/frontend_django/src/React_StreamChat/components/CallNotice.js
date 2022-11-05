import React from 'react';
import '../css/VideoChat.css'


let CallNotice = ({caller,accepted,rejected}) => {

    return(
        <div className = "SA_Call_Notice">
            <div className="SA_Notice">You are receiving a call from</div>
            <div className="SA_Caller">{caller}</div>
            <div className="SA_AcceptorReject">
                <div><button onClick={accepted} id="SA_Accept">Accept</button></div>
                <div><button onClick={rejected} id="SA_Reject">Reject</button></div>
            </div>
        </div>

    )
}

export {CallNotice}

