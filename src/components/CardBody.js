import React, { useState, useEffect } from 'react';
import api from '../services/api';
import moment from 'moment';

import './CardBody.css';
import success from '../assets/success.png';
import error from '../assets/error.png';
import closeSuccess from '../assets/close-success.png';
import closeError from '../assets/close-error.png';

import reload from '../assets/reload.png';
import document from '../assets/stacked-files.png';
import load from '../assets/loading.gif';

const initialState = {
  hours: 1,
  minutes: 0,
  seconds: 0
};

const CardBody = React.forwardRef((props, ref) => {
  const [today, setToday] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [extData, setExtData] = useState('');
  const [time, setTime] = useState({
    hours: parseInt(initialState.hours, 10),
    minutes: parseInt(initialState.minutes, 10),
    seconds: parseInt(initialState.seconds, 10)
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get('scrapper-list');
      const result = response.data.scrapper;
      const horario = ['02:00', '08:00', '10:00', '12:00', '15:00', '17:00', '19:00', '22:00'];
      const dayExtArray = result.filter(dataItem => {
        return dataItem.data === today;
      });
      
      const extArray = [];
      for (let i = 0; i < horario.length; i++) {
        if (dayExtArray.reverse().some(item => item.horario === horario[i]) === false) {
          extArray.push(`Nacional ${horario[i]}`);
        }
      }
      setExtData(extArray[0]);
    } catch (err) {
      
    }
  }

  const handleScrapeData = async () => {
    try {
      setLoading(true);
      const response = await api.get('scrapper-register');
      setLoading(false);
      setSuccessMsg(response.data.msg);
      fetchData();
      props.reloadData();
      setTimeout(() => setSuccessMsg(''), 10000);
    } catch (err) {
      setLoading(false);
      setErrorMsg('Erro ao extrair dados');
      setTimeout(() => setErrorMsg(''), 10000);
    }
  };

  React.useImperativeHandle(ref, () => ({
    updateExt() {
      fetchData();
    }
  }));

  const tick = () => {
    if (time.hours === 0 && time.minutes === 0 && time.seconds === 0) {
      handleScrapeData();
      setTime({
        hours: 2,
        minutes: 0,
        seconds: 0
      });
    } if (time.minutes === 0 && time.seconds === 0) {
      setTime({
        hours: time.hours - 1,
        minutes: 59,
        seconds: 59
      });
    } else if (time.seconds === 0) {
      setTime({
        hours: time.hours,
        minutes: time.minutes - 1,
        seconds: 59
      });
    } else {
      setTime({
        hours: time.hours,
        minutes: time.minutes,
        seconds: time.seconds - 1
      });
    }
  };

  useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);

    return () => clearInterval(timerID);
  });

  const handleCloseSuccess = () => {
    setSuccessMsg('');
  };

  const handleCloseError = () => {
    setErrorMsg('');
  };

  return (
    <React.Fragment>
      <div className="main-header">
        <div className="wrap-main-header">
          {!!successMsg && 
            <div className="alert-message success-message">
              <img src={success} alt="success" width="22" height="22"/>
              {successMsg}
              <span>
                <img onClick={handleCloseSuccess} src={closeSuccess} alt="close" width="10" height="10"/>
              </span>
            </div>
          }
          {!!errorMsg && 
            <div className="alert-message error-message">
              <img src={error} alt="error" width="22" height="22"/>
              {errorMsg}
              <span>
                <img onClick={handleCloseError} src={closeError} alt="close" width="10" height="10"/>
              </span>
            </div>
          }
          <div className="card-header">
            <div className="card-item">
              {/*<div className="opacity-card-item">
                <p>É Necessário fazer um upgrade no servidor de hospedagem</p>
              </div>*/}
              <div className="item-inner">
                <h4>Próxima Atualização</h4>
                {loading ? (
                  <img src={load} alt="loading..." width="32" height="32"/>
                ) : (
                  <span>{`${time.hours
                    .toString()
                    .padStart(2, '0')}:${time.minutes
                    .toString()
                    .padStart(2, '0')}:${time.seconds.toString().padStart(2, '0')}`}
                  </span>
                )}
              </div>
              <div className="item-inner">
                <div>
                  <img src={reload} alt="error" width="32" height="32"/>
                </div>
              </div>
            </div>
            <div className="card-item">
              <div className="item-inner">
                <h4>Próxima Extração do Dia</h4>
                <span>{extData}</span>
              </div>
              <div className="item-inner">
                <div>
                  <img src={document} alt="error" width="32" height="32"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

export default CardBody;
