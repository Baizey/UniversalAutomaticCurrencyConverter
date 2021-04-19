// This file is injected as a content script
import * as React from "react";
import {useContainer} from "./Infrastructure";

const container = useContainer()
const logger = container.logger;
logger.info('Running...')

const main = async () => {
    await container.startup.load();
}

main().catch(err => logger.error(err))
