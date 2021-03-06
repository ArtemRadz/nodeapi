import React from 'react';
import ReactDOM from 'react-dom';
import { makeMainRoutes } from './routes';
import registerServiceWorker from './registerServiceWorker';
import './normalize.css';
import './index.css';

const routes = makeMainRoutes();

ReactDOM.render(routes, document.getElementById('root'));
registerServiceWorker();