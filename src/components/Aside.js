import React from 'react';
import { NavLink } from 'react-router-dom';

import './Aside.css';

const Aside = () => {

  return (
    <aside className="aside-content">
      <div className="aside-nav">
        <ul className="nav-menu">
          <li><NavLink exact to='/' activeClassName="active"><p>Início</p></NavLink></li>
          <li><NavLink to='/analise-dezena' activeClassName="active"><p>Análise de Dezena</p></NavLink></li>
          <li><NavLink to='/analise-grupo' activeClassName="active"><p>Análise de Grupo</p></NavLink></li>
          <li><NavLink to='/analise-grupo-5-11' activeClassName="active"><p>Grupos 5 ao 11</p></NavLink></li>
          <li><NavLink to='/analise-extracao-por-dia' activeClassName="active"><p>Extração por dia</p></NavLink></li>
        </ul>
      </div>
    </aside>
  );
};

export default Aside;
