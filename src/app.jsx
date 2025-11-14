import React from 'react';
import {Routes, Route} from 'react-router-dom';

import StuHome from './pages/stuhome';
import WorkerHome from './pages/workerhome';
import AdminHome from './pages/adminhome';
import Login from './Login';
import RepairOrderList from './components/RepairOrderList';

function App(){
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/stuhome" element={<StuHome />} />
                <Route path="/workerhome" element={<WorkerHome />} />
                <Route path="/adminhome" element={<AdminHome />} />
                <Route path="/repairOrders" element={<RepairOrderList />} />
            </Routes>
        </div>
    );
};

export default App;