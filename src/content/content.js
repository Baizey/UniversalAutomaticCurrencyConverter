Engine.instance.load().finally(() => {
    chrome.runtime.onMessage.addListener(async function (data, sender, senderResponse) {
        switch (data.type) {
            case 'getHref':
                senderResponse({success: true, data: Browser.instance.hostname});
                break;
            case 'getConversionCount':
                senderResponse({success: true, data: NaN});
                break;
            case 'setActiveLocalizations':
                await ActiveLocalization.instance.overload(data.data);
                Detector.instance.updateSharedLocalizations();
                senderResponse({success: true})
                break;
            case 'getActiveLocalizations':
                senderResponse({success: true, data: ActiveLocalization.instance.compact});
                break;
        }
        return true;
    });
})