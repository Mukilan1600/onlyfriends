import React, { useState } from 'react'
import RecievedRequestsTab from './RecievedRequestsTab';
import SentRequestsTab from './SentRequestsTab';

import styles from './RequestsTabs.module.css';

const RequestsTabs: React.FC = () => {
    const [currentTab,setCurrentTab] = useState(0);

    const onSwitchTab = (index: number) => {
        setCurrentTab(index);
    }

    return (
        <div className={styles.body}>
            <div className={styles.tabsHeader}>
                <h4>Requests</h4>
                <div onClick={onSwitchTab.bind(this,0)} className={`${styles.tab} ${currentTab==0&&styles.active}`}>Received</div>
                <div onClick={onSwitchTab.bind(this,1)} className={`${styles.tab} ${currentTab==1&&styles.active}`}>Sent</div>
            </div>        
            <div>
                {currentTab===0 && <RecievedRequestsTab />}
                {currentTab===1 && <SentRequestsTab />}
            </div>
        </div>
    )
}

export default RequestsTabs
