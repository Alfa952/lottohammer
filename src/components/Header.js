import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Link to='/'>LottoHammer</Link>
        </div>
        <div className="header-nav">
          <h3>Dashboard</h3>
        </div>
      </div>
    </header>
  );
};

export default Header;
