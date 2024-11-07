// // src/components/AdminHome.js
// import React, { useState } from 'react';
// import Nav from '../../component/Header';
// import Banner from '../../component/Banner';
// import Category from '../../component/Category';
// import Hotsale from '../../component/Hotsale';
// import Banner2 from '../../component/Banner';
// import ProductTable from '../../component/Product';
// import Banner3 from '../../component/Banner';
// import locationsData from '../../component/Header/Locations.json';

// const AdminHome = () => {
//   const [expandedSection, setExpandedSection] = useState(null);
//   const [locations, setLocations] = useState(locationsData);
//   const [newLocation, setNewLocation] = useState('');
//   const [editingLocation, setEditingLocation] = useState(null);

//   const toggleSection = (section) => {
//     setExpandedSection(expandedSection === section ? null : section);
//   };

//   const handleAddLocation = () => {
//     if (newLocation.trim() !== '') {
//       const newId = locations.length ? Math.max(locations.map(loc => loc.id)) + 1 : 1; // Ensure unique ID
//       setLocations([...locations, { id: newId, name: newLocation }]);
//       setNewLocation('');
//     }
//   };

//   const handleEditLocation = (location) => {
//     setEditingLocation(location);
//     setNewLocation(location.name);
//   };

//   const handleUpdateLocation = () => {
//     if (editingLocation) {
//       setLocations(locations.map(location => 
//         location.id === editingLocation.id ? { ...location, name: newLocation } : location
//       ));
//       setNewLocation('');
//       setEditingLocation(null);
//     }
//   };

//   const handleDeleteLocation = (locationId) => {
//     setLocations(locations.filter(location => location.id !== locationId));
//   };

//   return (
//     <div className="admin-home">
//       <div className="list-group p-3">
//         <div className="list-group-item">
//           <h3 onClick={() => toggleSection('nav')} style={{ cursor: 'pointer' }}>
//             Navigation 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'nav' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'nav' && (
//             <div>
//               <h4>Quản lý Địa điểm</h4>
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>Tên địa điểm</th>
//                     <th>Hành động</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {locations.map(location => (
//                     <tr key={location.id}>
//                       <td>{editingLocation && editingLocation.id === location.id ? (
//                         <input 
//                           type="text" 
//                           value={newLocation} 
//                           onChange={(e) => setNewLocation(e.target.value)} 
//                         />
//                       ) : (
//                         location.name
//                       )}</td>
//                       <td>
//                         {editingLocation && editingLocation.id === location.id ? (
//                           <>
//                             <button className="btn btn-success" onClick={handleUpdateLocation}>
//                               Lưu
//                             </button>
//                             <button className="btn btn-secondary" onClick={() => {
//                               setEditingLocation(null);
//                               setNewLocation('');
//                             }}>
//                               Hủy
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button className="btn btn-warning" onClick={() => handleEditLocation(location)}>Sửa</button>
//                             <button className="btn btn-danger" onClick={() => handleDeleteLocation(location.id)}>Xóa</button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <input 
//                 type="text" 
//                 value={newLocation} 
//                 onChange={(e) => setNewLocation(e.target.value)} 
//                 placeholder="Thêm địa điểm mới" 
//               />
//               <button onClick={editingLocation ? handleUpdateLocation : handleAddLocation} className="btn btn-primary">
//                 {editingLocation ? 'Cập nhật' : 'Thêm'}
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       {/* Các phần khác của AdminHome không thay đổi */}
//       <div className="list-group p-3">
//         <div className="list-group-item list-group-item-action">
//           <h3 onClick={() => toggleSection('banner')} style={{ cursor: 'pointer' }}>
//             Banner 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'banner' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'banner' && <Banner />}
//         </div>
//       </div>
//       <div className="list-group p-3">
//         <div className="list-group-item list-group-item-action">
//           <h3 onClick={() => toggleSection('category')} style={{ cursor: 'pointer' }}>
//             Category 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'category' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'category' && <Category />}
//         </div>
//       </div>
//       <div className="list-group p-3">
//         <div className="list-group-item list-group-item-action">
//           <h3 onClick={() => toggleSection('hotsale')} style={{ cursor: 'pointer' }}>
//             Hot Sale 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'hotsale' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'hotsale' && <Hotsale />}
//         </div>
//       </div>
//       <div className="list-group p-3">
//         <div className="list-group-item list-group-item-action">
//           <h3 onClick={() => toggleSection('banner2')} style={{ cursor: 'pointer' }}>
//             Banner 2 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'banner2' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'banner2' && <Banner2 />}
//         </div>
//       </div>
//       <div className="list-group p-3">
//         <div className="list-group-item list-group-item-action">
//           <h3 onClick={() => toggleSection('productTable')} style={{ cursor: 'pointer' }}>
//             Product Table 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'productTable' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'productTable' && <ProductTable />}
//         </div>
//       </div>
//       <div className="list-group p-3">
//         <div className="list-group-item list-group-item-action">
//           <h3 onClick={() => toggleSection('banner3')} style={{ cursor: 'pointer' }}>
//             Banner 3 
//             <span style={{ float: 'right' }}>
//               {expandedSection === 'banner3' ? '▲' : '▼'}
//             </span>
//           </h3>
//           {expandedSection === 'banner3' && <Banner3 />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminHome;
