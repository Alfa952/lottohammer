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

const AnalizeGrupo = () => {
  const [date, setDate] = useState(new Date());
  const [diffDate, setDiffDate] = useState('');
  const [listData, setListData] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [extractionDate, setExtractionDate] = useState('00/00/00');
  const [loading, setLoading] = useState(true);
  const [warnMsg, setWarnMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchDataGroup();
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
  };

  const fetchDataGroup = async () => {
    const res = await axios.get("./grupos.json");
    const resultData = res.data;
    setGroupData(resultData);
  }

  const handleGetData = () => {
    handleDefaultValue();
    if (listData.length === 0) {
      setErrorMsg('Erro ao carregar dados');
    } else {
      const d = formatedDate(date)
      setExtractionDate(moment(d).format('DD/MM/YYYY'));

      const filteredByDate = listData.filter(itemByData => itemByData.data === d);
      if (filteredByDate && filteredByDate.length > 0) {
        const arrays = filteredByDate.map(item => {
          return item.sorteio.map(sortItem => sortItem.grupo);
        })
        const newArray = arrays.flat(1);
    
        const copyArray = [...groupData];
        for (let i = 0; i < copyArray.length; i++) {
          for (let j = 0; j < newArray.length; j++) {
            if (newArray[j] === copyArray[i].grupo) {
              copyArray[i].bg = "#2196f3";
              copyArray[i].color = "#ffffff";
            }
          }
        }
    
        setGroupData(copyArray);
      } else {
        setWarnMsg('Não há dados a serem analisados referente ao dia');
      }
    }   
  };

  const formatedDate = date => {
    const dt = moment(date).format('YYYY-MM-DD');
    return dt;
  };

  const handleDefaultValue = () => {
    for (let i = 0; i < groupData.length; i++) {
      groupData[i].bg = '#e8e8e8';
      groupData[i].color = "#5b626b";
    }
  };

  const handleCloseError = () => {
    setErrorMsg('');
  };

  const handleCloseWarn = () => {
    setWarnMsg('');
  };

  return (
    <Main>
      <div className="title-main-content">
        <h2 className="title">Análise de Grupo</h2>
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
            minDate={subDays(new Date(), diffDate)}
            maxDate={new Date()}
          />
          <div className="body-btn-content">
            <div className="confirm-btn" onClick={handleGetData}>Verificar</div>
          </div>
          <h4>Grupos não sorteados (<strong>em cinza</strong>) do dia <span>{extractionDate}</span></h4>
          <div className="body-result-content">
            <div className="box-result-b">
              {groupData.map((group, i) => (
                <span key={i} style={{background: group.bg, color: group.color}}>{group.grupo}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
};

export default AnalizeGrupo;
