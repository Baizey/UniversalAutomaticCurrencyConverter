// This file is ran as a background script
import {BackgroundMessage, BackgroundMessageType} from "./Infrastructure";

console.log("Hello from background script!")

function isCurrencyTag(value: any) {
    return typeof (value) === 'string' && /^[A-Z]{3}$/.test(value);
}

chrome.runtime.onMessage.addListener(function (request: BackgroundMessage, sender, senderResponse) {
    function success(data?: any): boolean {
        senderResponse({success: true, data: data})
        return true;
    }

    function failure(message: string): boolean {
        senderResponse({success: false, data: message})
        return true;
    }

    switch (request.type) {
        case BackgroundMessageType.ActiveRightClick:
            return success();
        case BackgroundMessageType.Rate:
            if (!isCurrencyTag(request.to) || !isCurrencyTag(request.to))
                return failure(`Invalid currency tags given (${request.from}, ${request.to})`)
            fetch(`https://fixer-middle-endpoint.azurewebsites.net/api/v3/rate/${request.from}/${request.to}/ba0974d4-e0a4-4fdf-9631-29cdcf363134`)
                .then(resp => resp.json())
                .then(resp => success(resp.symbols))
                .catch(err => failure(err.message))
            return true;
        case BackgroundMessageType.Symbols:
            fetch(`https://fixer-middle-endpoint.azurewebsites.net/api/v2/symbols/ba0974d4-e0a4-4fdf-9631-29cdcf363134`)
                .then(resp => resp.json())
                .then(resp => success(resp.symbols))
                .catch(err => failure(err.message))
            return true;
        case BackgroundMessageType.OpenPopup:
            chrome.tabs.create({
                url: 'popup.html',
                active: false
            }, tab => {
                chrome.windows.create({
                    tabId: tab.id,
                    focused: true,
                    type: 'popup',
                    width: 440,
                    height: 500,
                }, window => success(window));
            });
            return true;
        default:
            // @ts-ignore
            return failure(`Unknown message received, got type ${request.type}`)
    }
});