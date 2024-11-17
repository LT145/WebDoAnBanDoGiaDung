import React from 'react';
import SidebarUser from '../component/User/Profile/SidebarUser/SidebarUser';
import InfoUser from '../component/User/Profile/InfoUser/InfoUser';

const Profile = () => {

  return (
    <div>
       <div style={{display:'flex',width:'100%',justifyContent:'space-between',height:'calc(100% - 65px)', gap:'15px',margin:'0px auto', minWidth:'1150px',position:'absolute'}}>
          <SidebarUser />
          <div style={{width:'78%',}}>
            <InfoUser />
          </div>
        </div>
    </div>
  );
};

export default Profile;
