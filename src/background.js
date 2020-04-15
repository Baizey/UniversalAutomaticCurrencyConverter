const Ajax = {
    get: url => new Promise((resolve, reject) => {
        if (!url) return reject('No url given');
        const request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onreadystatechange = function () {
            if (request.readyState !== XMLHttpRequest.DONE)
                return;
            return request.status >= 200 && request.status < 300
                ? resolve(request.responseText)
                : reject(request.responseText);
        };
        request.send();
    })
};

function rate(request, senderResponse) {
    if (!isCurrencyTag(request.from)) {
        senderResponse({
            success: false,
            data: `error in rate, from '${request.from}' is not valid currency tag`
        });
    } else if (!isCurrencyTag(request.to)) {
        senderResponse({success: false, data: `error in rate, to '${request.to}' is not valid currency tag`});
    } else {
        const url = `https://fixer-middle-endpoint.azurewebsites.net/api/v3/rate/${request.from}/${request.to}/ba0974d4-e0a4-4fdf-9631-29cdcf363134`;
        Ajax.get(url).then(JSON.parse)
            .then(r => senderResponse({success: true, data: r}))
            .catch(r => senderResponse({success: false, data: JSON.stringify(r)}));
    }
}

function symbols(senderResponse) {
    const url = 'https://fixer-middle-endpoint.azurewebsites.net/api/v2/symbols/ba0974d4-e0a4-4fdf-9631-29cdcf363134';
    Ajax.get(url).then(JSON.parse)
        .then(r => senderResponse({success: true, data: r.symbols}))
        .catch(r => senderResponse({success: false, data: JSON.stringify(r)}));
}

function isCurrencyTag(value) {
    return typeof (value) === 'string' && /^[A-Z]{3}$/.test(value);
}

function openPopup(senderResponse) {
    chrome.tabs.create({
        url: 'popup/popup.html',
        active: false
    }, tab => {
        chrome.windows.create({
            tabId: tab.id,
            focused: true,
            type: 'popup',
            width: 440,
            height: 500,
        }, window => senderResponse({success: true, data: window}));
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
    switch (request.type) {
        case 'rate':
            rate(request, senderResponse);
            break;
        case 'symbols':
            symbols(senderResponse);
            break;
        case 'openPopup':
            openPopup(senderResponse);
            break;
        default:
            senderResponse({success: false, data: `Unknown type '${request.type}' for background`});
            break;
    }
    return true;
});

const openOptionsIfNew = async () => {
    const firstTimeKey = 'uacc:global:oldUser'
    const isOldUser  = (await Browser.instance.loadSync(firstTimeKey))[firstTimeKey];
    if (!isOldUser) {
        chrome.tabs.create({
            url: 'options/options.html',
            active: true
        });
    }
};

openOptionsIfNew().finally();

// TODO: re-implement this
/*
function getSelectedText(request, sender, senderResponse) {
    senderResponse({success: true, data: window.getSelection().toString()});
    return true;
}

chrome.contextMenus.create({
    title: `Add to mini converter`,
    contexts: ["selection"],
    onclick: data => {
        Browser.messageTab({
            method: 'contextMenu',
            text: data.selectionText
        }).finally();
    }
});
 */