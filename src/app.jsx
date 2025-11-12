import React from 'react';
//import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; //命令：npm install react-router-dom @types/react-router-dom
import {Routes, Route} from 'react-router-dom';

import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Login from './Login';

function App(){
    return (
        <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </div>
    );
};

export default App;