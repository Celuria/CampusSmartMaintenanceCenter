import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; //命令：npm install react-router-dom @types/react-router-dom

//import Home from './components/Home';
//import About from './components/About';
//import Contact from './components/Contact';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            {/* <Route path="/about" element={<About />} /> */}
            {/* <Route path="/contact" element={<Contact />} /> */}
            </Routes>
        </Router>
    );
};

export default AppRouter;