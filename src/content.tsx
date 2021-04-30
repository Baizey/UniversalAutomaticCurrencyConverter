// This file is injected as a content script
import * as React from "react";
import {useProvider} from "./Infrastructure";

const container = useProvider()
const logger = container.logger;
logger.info('Running...')

const main = async () => {
    await container.startup.load();
}

main().catch(err => logger.error(err))
