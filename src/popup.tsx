import * as React from "react";
import * as ReactDOM from "react-dom";
import PopupApp from "./Popup/PopupApp";
import {SelfStartingPage} from './Atoms';

ReactDOM.render(<SelfStartingPage Child={PopupApp}/>, document.getElementById("root"));
