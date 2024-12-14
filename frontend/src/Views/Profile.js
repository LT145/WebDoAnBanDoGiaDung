import React from 'react';
import SidebarUser from '../component/User/Profile/SidebarUser/SidebarUser';
import InfoUser from '../component/User/Profile/InfoUser/InfoUser';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Import Navigate để chuyển hướng
import HistoryOrder from '../component/User/Profile/HistoryOrder/HistoryOrder';
import OrderDetails from '../component/User/Profile/DetailsOrder/DetailsOrder';
const Profile = () => {

  return (
    <div>
       <div style={{display:'flex',width:'100%',justifyContent:'space-between',height:'calc(100% - 65px)', gap:'15px',margin:'0px auto', minWidth:'1150px',position:'absolute'}}>
          <SidebarUser />
          <div style={{width:'78%',}}>
            <Routes>
            <Route path="profile" element={<InfoUser />} />
            <Route path="history-order" element={<HistoryOrder />} />
            <Route path="history-order/details-order" element={<OrderDetails />} />
          </Routes>
          </div>
        </div>
    </div>
  );
};

export default Profile;
