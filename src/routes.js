import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {
    App,
    Home,
    Login,
    NotFound,
    History,
  } from 'containers';

export default () => {
  return (
    <Route path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes */ }
      <Route path="login" component={Login}/>
      <Route path="history/:id" component={History}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
