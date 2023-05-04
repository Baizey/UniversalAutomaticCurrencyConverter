// This file is run as a background script
import {handleError} from './di'
import {startServiceWorker} from "./serviceWorker";

startServiceWorker().catch(handleError)
