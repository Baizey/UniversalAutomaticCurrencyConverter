// This file is injected as a content script

import {useContainer} from "./Infrastructure";

const container = useContainer()
const logger = container.logger;
logger.info('Running...')

async function initialize() {
    const startup = container.startup;
    await startup.load();
}

(async () => {
    await initialize();
    logger.debug('Initialization done')
})().catch(err => logger.error(err))
