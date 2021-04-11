// This file is injected as a content script

import {Browser, Configuration} from "./Infrastructure";

const browser = Browser.instance();
const config = Configuration.instance();

console.log(`Hello ${browser.type} (${browser.environment})`)