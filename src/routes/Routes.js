import React, { useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router';

import Home from '../pages/Home';
import AnalizeDezena from '../pages/AnalizeDezena';
import AnalizeGrupo from '../pages/AnalizeGrupo';
import AnalizeGrupo511 from '../pages/AnalizeGrupo511';
import ExtracaoPorDia from '../pages/ExtracaoPorDia.js';

const Routes = React.forwardRef((props, ref) => {
  const update = useRef();

  React.useImperativeHandle(ref, () => ({
    update() {
      update.current.updateData();
    }
  }));

  const reloadExt = () => {
    props.reloadExt();
  };

  return (
    <Switch>
      <Route exact path='/' render={(props) => <Home {...props} ref={update} reloadExt={reloadExt}/>} />
      <Route path='/analise-dezena' component={AnalizeDezena} />
      <Route path='/analise-grupo' component={AnalizeGrupo} />
      <Route path='/analise-grupo-5-11' component={AnalizeGrupo511} />
      <Route path='/analise-extracao-por-dia' component={ExtracaoPorDia} />
      <Redirect from='*' to='/' />
    </Switch>
  );
});

export default Routes;
