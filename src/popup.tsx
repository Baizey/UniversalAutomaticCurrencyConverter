import * as React from "react";
import * as ReactDOM from "react-dom";

import PopupApp from "./Popup/PopupApp";
import {Container} from "./Infrastructure";

const container = Container.factory();
const logger = container.logger;
logger.info('Initializing popup');

ReactDOM.render(<PopupApp/>, document.getElementById("root"));
