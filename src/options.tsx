import * as React from 'react';
import * as ReactDOM from 'react-dom';
import OptionsApp from './components/options/OptionsApp';
import { ConfigurationContext } from './components/molecules';
import { FilterContext } from './components/molecules/contexts/FilterContext';

ReactDOM.render(
  <ConfigurationContext>
    <FilterContext>
      <OptionsApp />
    </FilterContext>
  </ConfigurationContext>,
  document.getElementById('root')
);
