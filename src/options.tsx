import * as React from "react";
import * as ReactDOM from "react-dom";
import OptionsApp from "./Options/OptionsApp";
import {ThemeProvider} from 'styled-components';
import {DarkTheme} from './Atoms/Theme';

ReactDOM.render(
    <ThemeProvider theme={DarkTheme}>
        <OptionsApp/>
    </ThemeProvider>,
    document.getElementById("root"));
