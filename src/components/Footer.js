import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './Footer.css';

const Footer = () => {
  const [date] = useState(new Date());
  const [year, setYear] = useState('');

  useEffect(() => {
    const year = moment(date).format('YYYY'); 
    setYear(year);
  });

  return (
    <footer className="footer">
      <div>
        <h4> {year} © LottoHammer - Rodrigo SJ </h4>
      </div>
    </footer>
  );
};

export default Footer;
