import * as React from "react";
import * as ReactDOM from "react-dom";

import OptionsApp from "./Options/OptionsApp";
import {Container} from "./Infrastructure";

const container = Container.factory();
const logger = container.logger;
logger.info('Initializing options');

ReactDOM.render(<OptionsApp/>, document.getElementById("root"));
