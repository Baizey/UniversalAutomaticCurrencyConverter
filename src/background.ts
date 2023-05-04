// This file is run as a background script
import {handleError} from './di'
import {run} from "./serviceWorker";

run().catch(handleError)
