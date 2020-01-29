import React, { useState, useEffect } from 'react';
import Main from '../components/Main';
import api from '../services/api';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import { subDays } from 'date-fns';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import warn from '../assets/warning.png';
import error from '../assets/error.png';
import closeWarn from '../assets/close-warn.png';
import closeError from '../assets/close-error.png';
import load from '../assets/loading.gif';

const AnalizeDezena = () => {
  const [date, setDate] = useState(new Date());
  const [diffDate, setDiffDate] = useState(null);
  const [listData, setListData] = useState([]);
  const [dezData, setDezData] = useState([]);
  const [extractionDate, setExtractionDate] = useState('00/00/00');
  const [loading, setLoading] = useState(true);
  const [warnMsg, setWarnMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDataDezena();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await api.get('scrapper-list');
      const result = response.data.scrapper;
      if (result.length > 0) {
        setListData(result);
        const lengthData = result.length - 1;
        const initialDate = result[lengthData].data;
        const day = initialDate.slice(-2);
        const month = initialDate.slice(5, 7);
        const year = initialDate.slice(0, 4);
        const date1 = month + '/' + day + '/' + year;
        const date2 = moment(new Date());
        const duration = moment.duration(date2.diff(date1));
        const days = Math.floor(duration.asDays());
        setDiffDate(days);
        setLoading(false);
      } else {
        setLoading(false);
        setWarnMsg('Não há dados no banco!');
      }
      
    } catch(err) {
      setLoading(false);
      setErrorMsg('Erro ao carregar dados');
    }
  }

  const fetchDataDezena = async () => {
    const res = await axios.get("./dezenas.json");
    const resultData = res.data;
    setDezData(resultData);
  }

  // função para setar os valores de data
  const handleGetData = () => {
    handleDefaultValue();
    if (listData.length === 0) {
      setErrorMsg('Erro ao carregar dados');
    } else {
      const d = formatedDate(date);
      setExtractionDate(moment(d).format('DD/MM/YYYY'));

      const filteredByDate = listData.filter(itemByData => itemByData.data === d);
      if (filteredByDate && filteredByDate.length > 0) {
        const arrays = filteredByDate.map(item => {
          return item.sorteio.map(sortItem => sortItem.numeros.slice(-2).join(''));
        });
        const newArray = arrays.flat(1);
        // ou: const newArray = [].concat.apply([], arrays);
    
        const copyArray = [...dezData];
        for (let i = 0; i < copyArray.length; i++) {
          for (let j = 0; j < newArray.length; j++) {
            if (newArray[j] === copyArray[i].value) {
              copyArray[i].bg = "#2196f3";
              copyArray[i].color = "#ffffff";
            }
          }
        }
        setDezData(copyArray);
      } else {
        setWarnMsg('Não há dados a serem analisados referente ao dia');
      }
    }    
  };

  // função para formatar data
  const formatedDate = date => {
    const dt = moment(date).format('YYYY-MM-DD');
    return dt;
  };

  // função para setar o valor padrão do json
  const handleDefaultValue = () => {
    for (let i = 0; i < dezData.length; i++) {
      dezData[i].bg = '#e8e8e8';
      dezData[i].color = "#5b626b";
    }
  };

  const handleCloseWarn = () => {
    setWarnMsg('');
  };

  const handleCloseError = () => {
    setErrorMsg('');
  };
  
  return (
    <Main>
      <div className="title-main-content">
        <h2 className="title">Análise de Dezena</h2>
      </div>
      <div className="body-main-content">
        {!!warnMsg && 
          <div className="alert-message  warn-message">
            <img src={warn} alt="success" width="22" height="22"/>
            {warnMsg}
            <span>
              <img onClick={handleCloseWarn} src={closeWarn} alt="close" width="10" height="10"/>
            </span>
          </div>
        }
        {!!errorMsg && 
          <div className="alert-message  error-message">
            <img src={error} alt="error" width="22" height="22"/>
            {errorMsg}
            <span>
              <img onClick={handleCloseError} src={closeError} alt="close" width="10" height="10"/>
            </span>
          </div>
        }
        <div className="body-analyze">
          {loading && 
            <div className="display-load">
              Carregando Dados... 
              <img src={load} alt="loading..." width="32" height="32"/>
            </div>
          }
          <h4>Selecione a data para análise</h4>
          <DatePicker 
            selected={date}
            onChange={date => setDate(date)}
            onKeyDown={(e) => e.preventDefault()}
            minDate={subDays(new Date(), diffDate)}
            maxDate={new Date()}
          />
          <div className="body-btn-content">
            <div className="confirm-btn" onClick={handleGetData}>Verificar</div>
          </div>
          <h4>Dezenas não sorteadas (<strong>em cinza</strong>) do dia <span>{extractionDate}</span></h4>
          <div className="body-result-content">
            <div className="box-result">
              {dezData.map((dezena, i) => (
                <span key={i} className="box-result-item" style={{background: dezena.bg, color: dezena.color}}>{dezena.value}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default AnalizeDezena;
