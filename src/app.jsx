import React from 'react';
import {Routes, Route} from 'react-router-dom';

import StuHome from './pages/student/stuhome';
import WorkerHome from './pages/worker/workerhome';
import AdminHome from './pages/admin/adminhome';
import Login from './Login';

function App(){
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/stuhome" element={<StuHome />} />
                <Route path="/workerhome" element={<WorkerHome />} />
                <Route path="/adminhome" element={<AdminHome />} />
                {/*<Route path="/about" element={<About />} />*/}
                {/*<Route path="/contact" element={<Contact />} />*/}
            </Routes>
        </div>
    );
};

export default App;