import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PopupApp from './components/popup/PopupApp';
import { ConfigurationContext } from './components/molecules';
import { FilterContext } from './components/molecules/contexts/FilterContext';

ReactDOM.render(
  <ConfigurationContext>
    <FilterContext>
      <PopupApp />
    </FilterContext>
  </ConfigurationContext>,
  document.getElementById('root')
);
