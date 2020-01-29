import React, { useRef } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';

import Routes from './routes/Routes';
import Header from './components/Header';
import Aside from './components/Aside';
import CardBody from './components/CardBody';
import Footer from './components/Footer';

function App() {
  const reloadRef = useRef();
  const updateExtRef = useRef();

  const reloadData = () => {
    reloadRef.current.update();
  };

  const reloadExt = () => {
    updateExtRef.current.updateExt();
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Aside />
        <CardBody reloadData={reloadData} ref={updateExtRef}/>
        <Routes ref={reloadRef} reloadExt={reloadExt}/>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
