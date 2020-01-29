import React, { useState, useEffect } from 'react';
import Main from '../components/Main';
import api from '../services/api';
import moment from 'moment';

import './Page.css';
import success from '../assets/success.png';
import warn from '../assets/warning.png';
import error from '../assets/error.png';
import closeSuccess from '../assets/close-success.png';
import closeWarn from '../assets/close-warn.png';
import closeError from '../assets/close-error.png';
import load from '../assets/loading.gif';

const Home = React.forwardRef((props, ref) => {
  const [listData, setListData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [reload, setReload] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [warnMsg, setWarnMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData =  async () => {
    try {
      setIsDisabled(false);
      const response = await api.get('scrapper-list');
      const result = response.data.scrapper;
      if (result.length > 0) {
        setLoadingData(false);
        setIsDisabled(true);
        setListData(result);
      } else {
        setLoadingData(true);
        setIsDisabled(true);
        setWarnMsg('Não há dados no banco!');
      }
    } catch (err) {
      setLoadingData(false);
      setIsDisabled(true);
      setErrorMsg('Erro ao carregar dados');
    }
  }

  const handleScrapeData = async () => {
    try {
      setIsDisabled(false);
      setLoading(true);
      const response = await api.get('scrapper-register');
      setLoading(false);
      setIsDisabled(true);
      setSuccessMsg(response.data.msg);
      handleReloadData();
      props.reloadExt();
      setTimeout(() => setSuccessMsg(''), 10000);
    } catch (err) {
      setLoading(false);
      setIsDisabled(true);
      setErrorMsg('Erro ao extrair dados');
      setTimeout(() => setErrorMsg(''), 10000);
    }
  };

  React.useImperativeHandle(ref, () => ({
    updateData() {
      handleReloadData();
    }
  }));

  const handleReloadData =  async () => {
    try {
      setIsDisabled(false);
      setReload(true);
      const response = await api.get('scrapper-list');
      const result = response.data.scrapper;
      if (result.length > 0) {
        setReload(false);
        setIsDisabled(true);
        setListData(result);
      } else {
        setReload(false);
        setIsDisabled(true);
        setWarnMsg('Não há dados no banco!');
      }
    } catch (err) {
      setReload(false);
      setIsDisabled(true);
      setErrorMsg('Erro ao carregar dados');
      setTimeout(() => setErrorMsg(''), 10000);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMsg('');
  };

  const handleCloseWarn = () => {
    setWarnMsg('');
  };

  const handleCloseError = () => {
    setErrorMsg('');
  };

  return (
    <React.Fragment>
      <Main>
        <div className="body-main-content">
          {!!successMsg && 
            <div className="alert-message success-message">
              <img src={success} alt="success" width="22" height="22"/>
              {successMsg}
              <span>
                <img onClick={handleCloseSuccess} src={closeSuccess} alt="close" width="10" height="10"/>
              </span>
            </div>
          }
          {!!warnMsg && 
            <div className="alert-message warn-message">
              <img src={warn} alt="warn" width="22" height="22"/>
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
          <div className="box-default">
            <div className="box-header">
              <h4>Resultados</h4>
              <div className="box-header-actions">
                  {loading && 
                    <div>
                      <img src={load} alt="loading..." width="32" height="32"/>
                    </div>
                  }
                  {reload && 
                    <div>
                      <img src={load} alt="loading..." width="32" height="32"/>
                    </div>
                  }
                  <button className="extract-data" onClick={handleScrapeData} disabled={!isDisabled}>
                    Extrair
                  </button>
                  <button className="reload-data" onClick={handleReloadData} disabled={!isDisabled}>
                    Atualizar
                  </button>
              </div>
            </div>
            {!warnMsg &&
              <div className="box-body">
                {loadingData ? (
                  <div className="display-load">
                    Carregando Dados... 
                    <img src={load} alt="loading..." width="32" height="32"/>
                  </div>
                ) : (
                  <React.Fragment>
                    {listData.slice(0, 8).map((drawDetail, i) => {
                      return (
                        <div key={i} className="card-detail">
                          <div className="header-dados">
                            <h4>Horário: {drawDetail.horario}</h4>
                            <h4>Data: {moment(drawDetail.data).format('DD/MM/YYYY')}</h4>
                          </div>
                          <table>
                            <thead>
                              <tr>
                                <th>Prêmios</th>
                                <th>Números</th>
                                <th>Grupos</th>
                              </tr>
                            </thead>
                            <tbody>
                              {drawDetail.sorteio.map((detail, i) => {
                                return (
                                  <tr key={i}>
                                    <td>{detail.premio}</td>
                                    <td>
                                    {detail.numeros.map((n, i) => {
                                      return (
                                        <span key={i}>{n}</span>
                                      )
                                    })}
                                    </td>
                                    <td>{detail.grupo}</td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      );
                    })}
                  </React.Fragment>
                )}
              </div>
            } 
          </div>
          {/* <TableItem 
            scrapeData={handleScrapeData} 
            loadingExtract={loadingExtract}
            setConectionError={setConectionError}
            ref={childRef}
          /> */}
        </div>
      </Main>
    </React.Fragment>
  );
});

export default Home;
