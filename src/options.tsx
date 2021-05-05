import * as React from "react";
import {useState} from "react";
import * as ReactDOM from "react-dom";
import OptionsApp from "./Options/OptionsApp";
import {ThemeProvider} from 'styled-components';
import {mapToTheme} from './Atoms/StyleTheme';
import {useProvider} from './Infrastructure';

const provider = useProvider();
const themeSetting = provider.themeConfiguration.theme;

function OptionsPage() {
    const [theme, setTheme] = useState(themeSetting.value)
    return <ThemeProvider theme={mapToTheme(theme)}>
        <OptionsApp setTheme={setTheme}/>
    </ThemeProvider>
}

ReactDOM.render(<OptionsPage/>, document.getElementById("root"));
