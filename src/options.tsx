import * as React from "react";
import * as ReactDOM from "react-dom";
import OptionsApp from "./Options/OptionsApp";
import {SelfStartingPage} from './Atoms';

ReactDOM.render(<SelfStartingPage Child={OptionsApp}/>, document.getElementById("root"));

