// This file is injected as a content script

import {Browser} from "./Infrastructure";

const browser = Browser.instance();

console.log(`Hello ${browser.type} (${browser.environment})`)