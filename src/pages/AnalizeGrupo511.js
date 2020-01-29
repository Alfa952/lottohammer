/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react';
import Main from '../components/Main';
import api from '../services/api';
import DatePicker from 'react-datepicker';
import { subDays } from 'date-fns';
import moment from 'moment';

import "react-datepicker/dist/react-datepicker.css";
import warn from '../assets/warning.png';
import error from '../assets/error.png';
import closeWarn from '../assets/close-warn.png';
import closeError from '../assets/close-error.png';
import load from '../assets/loading.gif';

const AnalizeGrupo511 = () => {
  const [date, setDate] = useState(new Date());
  const [diffDate, setDiffDate] = useState('');
  const [listData, setListData] = useState([]);
  const [newListData, setNewListDate] = useState([]);
  const [extData, setExtData] = useState([]);
  const [count, setCount] = useState({count1: 0, count2: 0, count3: 0, count4: 0, count5: 0, count6: 0, count7: 0});
  const [extractionDate, setExtractionDate] = useState('00/00/00');
  const [loading, setLoading] = useState(true);
  const [warnMsg, setWarnMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
        let counter1 = count.count1, counter2 = count.count2, counter3 = count.count3;
        let counter4 = count.count4, counter5 = count.count5, counter6 = count.count6; 
        let counter7 = count.count7;
        const mappedResults = result.reverse().map((dataResults, index) => {
          if(!(index % 8)) {
            const dataJson = {}; 
            dataJson.resultado = [];
            dataJson.data = dataResults.data;
            const resultArray = result.filter(item => item.data === dataResults.data);
            for (let i = 1; i <= arrayLength; i++) {
              let n = resultArray.length;
              let m = 0;
              const itemJson = {};
              itemJson.extracao = [];
              itemJson.premio = `${[i]}º Prêmio`;
              if (i === 1) {
                for (let j = 0; j < resultArray.length && m < n; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter1 = 0;
                  } else {
                    counter1 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter1,
                  }
                  m++;
                }
                setCount({ count1: counter1 });
              } else if (i === 2) {
                for (let j = 0; j < resultArray.length && n >= 0; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter2 = 0;
                  } else {
                    counter2 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter2,
                  }
                  m++;
                }
                setCount({ count2: counter2 });
              } else if (i === 3) {
                for (let j = 0; j < resultArray.length && n >= 0; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter3 = 0;
                  } else {
                    counter3 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter3,
                  }
                  m++;
                }
                setCount({ count3: counter3 });
              } else if (i === 4) {
                for (let j = 0; j < resultArray.length && n >= 0; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter4 = 0;
                  } else {
                    counter4 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter4,
                  }
                  m++;
                }
                setCount({ count4: counter4 });
              } else if (i === 5) {
                for (let j = 0; j < resultArray.length && n >= 0; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter5 = 0;
                  } else {
                    counter5 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter5,
                  }
                  m++;
                }
                setCount({ count5: counter5});
              } else if (i === 6) {
                for (let j = 0; j < resultArray.length && n >= 0; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter6 = 0;
                  } else {
                    counter6 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter6,
                  }
                  m++;
                }
                setCount({ count6: counter6 });
              } else if (i === 7) {
                for (let j = 0; j < resultArray.length && n >= 0; j++) {
                  let g = resultArray[m].sorteio[i-1].grupo;
                  if (g === '5' || g === '6' || g === '7' || g === '8' || g === '9' || g === '10' || g === '11') {
                    counter7 = 0;
                  } else {
                    counter7 += 1;
                  }
                  itemJson.extracao[j] = {
                    horario: resultArray[m].horario,
                    grupo: resultArray[m].sorteio[i-1].grupo,
                    count: counter7,
                  }
                  m++;
                }
                setCount({ count7: counter7 });
              }
              dataJson.resultado.push(itemJson);
            }
            return dataJson;
          }
        }).filter((element, index) => {
          if(element !== undefined) {
            return element;
          }
        });
        setListData(mappedResults);

        // pegando data inicial
        const initialDate = mappedResults[0].data;
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

  const handleGetData = () => {
    if (listData.length === 0) {
      setErrorMsg('Erro ao carregar dados');
    } else {
      const d = formatedDate(date)
      setExtractionDate(moment(d).format('DD/MM/YYYY'));

      const filteredByDate = listData.filter(itemByData => {
        return itemByData.data === d
      }).map(item => item.resultado);
      if (filteredByDate && filteredByDate.length > 0) {
        setWarnMsg('');
        const newFilteredByDate = filteredByDate[0]
        setNewListDate(newFilteredByDate);
        const str = ['Prêmios'];
        const ext = newFilteredByDate.slice(0,1).map(extItem => {
          return extItem.extracao.map(item => {
            const st = item.horario.slice(0,2);
            if (st < 10) {
              return `Ext ${item.horario.slice(1,2)}h`;
            } else {
              return `Ext ${item.horario.slice(0,2)}h`;
            }
          })
        })
        const newExt = ext[0] 
        const extArray = str.concat(newExt);
        setExtData(extArray);
      } else {
        setWarnMsg('Não há dados a serem analisados referente ao dia');
        setExtData([]);
        setNewListDate([]);
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
        <h2 className="title">Análise do Grupo 5 ao 11</h2>
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
          <h4>Grupos de 5 ao 11 do dia <span>{extractionDate}</span></h4>
          <div className="body-result-content">
            <div className="box-full">
              <table>
                <thead>
                  <tr>
                    {extData.map((data, i) => (
                      <th key={i}>{data}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {newListData.map((data, i) => (
                    <tr key={i}>
                      <td>{data.premio}</td>
                      {data.extracao.map((dataItem, j) => (
                        <td key={j}>{dataItem.count}</td>
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

export default AnalizeGrupo511;
