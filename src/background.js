/**
 * @type {{get: (function(string): Promise<*>)}}
 */
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

/**
 * @param request
 * @return {string|undefined}
 */
const constructUrl = request => {
    switch (request.type) {
        case 'fixer-symbols':
            return `http://data.fixer.io/api/symbols?access_key=${encodeURIComponent(request.apiKey)}`;
        case 'fixer-rates':
            return `http://data.fixer.io/api/latest?access_key=${encodeURIComponent(request.apiKey)}`;
        case 'exchangeratesapi':
            return `https://api.exchangeratesapi.io/latest?base=${encodeURIComponent(request.base)}`;
    }
};

/**
 * @param {{type:string, base:undefined|string, apiKey:undefined|string}} request
 * @param sender
 * @param senderResponse
 * @return {boolean}
 */
function corsHandler(request, sender, senderResponse) {
    Ajax.get(constructUrl(request))
        .then(JSON.parse)
        .then(r => senderResponse({success: true, data: r}))
        .catch(error => senderResponse({success: false, data: JSON.stringify(error)}));
    return true;
}

function getSelectedText(request, sender, senderResponse) {
    senderResponse({success: true, data: window.getSelection().toString()});
    return true;
}

function handleError(request, senderResponse) {
    senderResponse({success: false, data: `Unknown method ${request.method}`});
    return true;
}

chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
    switch (request.method) {
        case 'getSelectedText':
            return getSelectedText(request, sender, senderResponse);
        case 'HttpGet':
            return corsHandler(request, sender, senderResponse);
        default:
            return handleError(request, senderResponse);
    }

});