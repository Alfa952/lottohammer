import React, { useState, useEffect } from 'react';
import Main from '../components/Main';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import { subDays } from 'date-fns';
import Select from 'react-select';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import warn from '../assets/warning.png';
import error from '../assets/error.png';
import closeWarn from '../assets/close-warn.png';
import closeError from '../assets/close-error.png';
import load from '../assets/loading.gif';

const options = [
  { value: '1º Prêmio', label: '1º Prêmio' },
  { value: '2º Prêmio', label: '2º Prêmio' },
  { value: '3º Prêmio', label: '3º Prêmio' },
  { value: '4º Prêmio', label: '4º Prêmio' },
  { value: '5º Prêmio', label: '5º Prêmio' },
  { value: '6º Prêmio', label: '6º Prêmio' },
  { value: '7º Prêmio', label: '7º Prêmio' },
];

const ExtracaoPorDia = () => {
  const [option, setOption] = useState(null);
  const [date, setDate] = useState(new Date());
  const [diffDate, setDiffDate] = useState('');
  const [listData, setListData] = useState([]);
  const [newListData, setNewListData] = useState([]);
  const [period, setPeriod] = useState([]);
  const [warnMsg, setWarnMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [extractionDate, setExtractionDate] = useState('00/00/00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  const fetchData = async () => {
    try {
      const response = await api.get('scrapper-list');
      const result = response.data.scrapper;
      if (result.length > 0) {
        const arrayLength = 7;
        const mappedResults = [];
        const horario = ['02:00', '08:00', '10:00', '12:00', '15:00', '17:00', '19:00', '22:00'];
        let m = 0;
        for (let i = 1; i <= arrayLength; i++) {
          const dataJson = {};
          dataJson.extracao = [];
          dataJson.premio = `${[i]}º Prêmio`;
          let n = 1

          for (let j = 0; j < horario.length; j++) {
            const resultJson = {}
            resultJson.resultado = [];
            const resultLength = result.length - n;
            let count = 0;

            resultJson.horario = horario[j];
            for (let k = resultLength; k >= 0; k -= 8) {
              const itemJson = {}
              itemJson.data = result[k].data;
              let g = result[k].sorteio[m].grupo;
              if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                count = 0;
              } else {
                count += 1;
              }
              itemJson.grupo = g;
              itemJson.count = count;

              resultJson.resultado.push(itemJson)
            }
            n++;
            dataJson.extracao.push(resultJson);
          }
          m++;
          mappedResults.push(dataJson);
        }
        setListData(mappedResults);

        // pegando data inicial
        const value = result.length - 1;
        const initialDate = result[value].data;
        const day = initialDate.slice(-2);
        const month = initialDate.slice(5, 7);
        const year = initialDate.slice(0, 4);
        const date1 = month + '/' + day + '/' + year;
        const date2 = moment(new Date());
        const duration = moment.duration(date2.diff(date1));
        const days = Math.floor(duration.asDays());
        setLoading(false);
        setDiffDate(days);
      } else {
        setLoading(false);
        setWarnMsg('Não há dados no banco!');
      }
    } catch(err) {
      setLoading(false);
      setErrorMsg('Erro ao carregar dados');
    }
    
  };

  const handleChange = option => {
    setOption(option);
  };

  const handleGetData = () => {
    if (listData.length === 0) {
      setErrorMsg('Erro ao carregar dados');
    } else if (option === null) {
      setWarnMsg('É necessário selecionar um prêmio para análise');
    } else {
      const premio = option.value;

      const filteredList = listData.filter(itemList => {
        return itemList.premio === premio;
      }).map(item => item.extracao);
      const newFilteredList = filteredList[0];

      const d = formatedDate(date)
      setExtractionDate(moment(d).format('DD/MM/YYYY'));

      if (newFilteredList[7].resultado.length < 5) {
        setWarnMsg('É necessário ao menos 5 dias para a análise');
      } else if (newFilteredList[0].resultado.some(item => item.data === d) === false) {
        setWarnMsg('Não há dados a serem analisados referente ao dia');
        setPeriod([]);
        setNewListData([]);
      } else if (newFilteredList[7].resultado.length >= 5) {
        setWarnMsg('');
        const dateArray = [];
        for (let i = 0; i < newFilteredList.length; i++) {
          const dateResult = newFilteredList[i].resultado;
          const firstItem = newFilteredList[i].resultado[0].data;
          const secItem = newFilteredList[i].resultado[1].data;
          const penItem = newFilteredList[i].resultado[dateResult.length - 2].data;
          const lastItem = newFilteredList[i].resultado[dateResult.length - 1].data;
          if (dateResult.length >= 5) {
            for (let j = 0; j < dateResult.length; j++) {
              if (dateResult[j].data === d && dateResult[j].data === firstItem) {
                const index = dateResult.findIndex(item => item.data === dateResult[j].data);
                for (let k = index; k < 5; k++) {
                  dateArray.push(k);
                }
              } else if (dateResult[j].data === d && dateResult[j].data === secItem) {
                const index = dateResult.findIndex(item => item.data === dateResult[j].data); 
                const max = index + 3;
                for (let k = index - 1; k <= max; k++) {
                  dateArray.push(k);
                }
              } else if (dateResult[j].data === d && dateResult[j].data === penItem) {
                const index = dateResult.findIndex(item => item.data === dateResult[j].data);
                const max = index + 1;
                for (let k = index - 3; k <= max; k++) {
                  dateArray.push(k);
                }
              } else if (dateResult[j].data === d && dateResult[j].data === lastItem) {
                const index = dateResult.findIndex(item => item.data === dateResult[j].data);
                const max = index;
                for (let k = index - 4; k <= max; k++) {
                  dateArray.push(k);
                }
              } else if (dateResult[j].data === d) {
                const index = dateResult.findIndex(item => item.data === dateResult[j].data);
                const max = index + 2;
                for (let k = index - 2; k <= max; k++) {
                  dateArray.push(k);
                }
              }
            }
          } 
        }

        const newData = [];
        newFilteredList.forEach((itemData, index) => {
          const itemDataJson = {};
          const newArray = itemData.resultado.filter((item, index) => {
            return dateArray.indexOf(index) !== -1;
          });
          itemDataJson.resultado = [...newArray];
          itemDataJson.horario = itemData.horario;
          newData.push(itemDataJson);
        });
        setNewListData(newData);

        const str = ['Extrações'];
        const getPeriod = newData[0].resultado;
        const periodArray = getPeriod.map(item => {
          return moment(item.data).format('DD/MM');
        });
        const period = str.concat(periodArray);
        setPeriod(period);
      }
    }
  };

  const formatedDate = date => {
    const dt = moment(date).format('YYYY-MM-DD');
    return dt;
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
        <h2 className="title">Análise de Extrações por Dia</h2>
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
          <div className="alert-message error-message">
            <img src={error} alt="error" width="22" height="22"/>
            {errorMsg}
            <span>
              <img onClick={handleCloseError} src={closeError} alt="close" width="10" height="10"/>
            </span>
          </div>
        }
        <div className="body-analyze">
          <div className="actions">
            {loading && 
              <div className="display-load">
                Carregando Dados... 
                <img src={load} alt="loading..." width="32" height="32"/>
              </div>
            }
            <div className="action-option">
              <h4>Selecione um prêmio para análise</h4>
              <Select
                value={option}
                onChange={handleChange}
                options={options}
              />
            </div>
            <div className="action-option">
              <h4>Selecione uma data para análise</h4>
              <DatePicker 
                selected={date}
                onChange={date => setDate(date)}
                minDate={subDays(new Date(), diffDate)}
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="body-btn-content">
            <div className="confirm-btn" onClick={handleGetData}>Verificar</div>
          </div>
          <h4>
            Extrações por dia do
            {option === null ? (
              <span> 0º Prêmio </span>
            ) : (
              <span> {option.value} </span>
            )}
            do dia <span>{extractionDate}</span>
          </h4>
          <div className="body-result-content">
            <div className="box-full">
              <table>
                <thead>
                  <tr>
                    {period.map((data, i) => (
                      <React.Fragment>
                        {data === extractionDate.slice(0, 5) ? (
                          <th key={i} style={{backgroundColor: "#2196f3", color: "#ffffff"}}>{data}</th>
                        ) : (
                          <th key={i}>{data}</th>
                        )}
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newListData.map((data, i) => (
                    <tr key={i}>
                      <td>{data.horario}</td>
                        {data.resultado.map((item, j) => (
                          <td key={j}>{item.count}</td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
};

export default ExtracaoPorDia;
