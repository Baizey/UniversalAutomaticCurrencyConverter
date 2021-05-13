// This file is ran as a background script
import {BackgroundMessage, BackgroundMessageType} from "./Infrastructure";
import {useProvider} from './Infrastructure';

const container = useProvider()
const logger = container.logger;
logger.info('Initializing background');

function isCurrencyTag(value: any): boolean {
    return ((typeof value) === 'string') && /^[A-Z]{3}$/.test(value);
}

chrome.runtime.onMessage.addListener(function (request: BackgroundMessage, sender, senderResponse): boolean {
    function success(data: any): boolean {
        senderResponse({success: true, data: data})
        return true;
    }

    function failure(message: string): boolean {
        senderResponse({success: false, data: message})
        return true;
    }

    if (!request) return failure(`No request received`)
    switch (request.type) {
        case BackgroundMessageType.getRate:
            if (!isCurrencyTag(request.to) || !isCurrencyTag(request.from))
                return failure(`Invalid currency tags given (${request.from}, ${request.to})`)
            if (request.from === request.to) return success(1)
            fetch(`https://fixer-middle-endpoint.azurewebsites.net/api/v3/rate/${request.from}/${request.to}/ba0974d4-e0a4-4fdf-9631-29cdcf363134`)
                .then(resp => resp.json())
                .then(resp => success(resp))
                .catch(err => failure(err.message))
            return true;
        case BackgroundMessageType.getSymbols:
            fetch(`https://fixer-middle-endpoint.azurewebsites.net/api/v2/symbols/ba0974d4-e0a4-4fdf-9631-29cdcf363134`)
                .then(resp => resp.json())
                .then(resp => success(resp.symbols))
                .catch(err => failure(err.message))
            return true;
        default:
            // @ts-ignore
            return failure(`Unknown message received, got type ${request.type}`)
    }
});