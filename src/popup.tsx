import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PopupApp from './components/popup/PopupApp';
import { SelfStartingPage } from './components/atoms';

ReactDOM.render(
  <SelfStartingPage Child={PopupApp} />,
  document.getElementById('root')
);
