import * as React from "react";
import * as ReactDOM from "react-dom";
import OptionsApp from "./Options/OptionsApp";
import {useProvider} from './Infrastructure';

const provider = useProvider();

ReactDOM.render(<OptionsApp/>, document.getElementById("root"));
