import React from 'react';
import './Main.css';

const Main = props => {
  return (
    <React.Fragment>
      <main className="main-content">
        <div className="wrap-main-content">
          {props.children}
        </div>
      </main>
    </React.Fragment>
  );
};

export default Main;
