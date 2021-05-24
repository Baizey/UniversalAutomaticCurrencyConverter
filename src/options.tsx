import * as React from "react";
import * as ReactDOM from "react-dom";
import OptionsApp from './components/options/OptionsApp';
import {SelfStartingPage} from './components/atoms';

ReactDOM.render(<SelfStartingPage Child={OptionsApp}/>, document.getElementById("root"));

