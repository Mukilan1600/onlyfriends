import React, { useState } from 'react'
import RecievedRequestsTab from './RecievedRequestsTab';
import SentRequestsTab from './SentRequestsTab';

const RequestsTabs: React.FC = () => {
    const [currentTab,setCurrentTab] = useState(0);

    const onSwitchTab = (index: number) => {
        setCurrentTab(index);
    }

    return (
        <div>
            <div>
                <div onClick={onSwitchTab.bind(this,0)}>Received</div>
                <div onClick={onSwitchTab.bind(this,1)}>Sent</div>
            </div>        
            <div>
                {currentTab===0 && <RecievedRequestsTab />}
                {currentTab===1 && <SentRequestsTab />}
            </div>
        </div>
    )
}

export default RequestsTabs
