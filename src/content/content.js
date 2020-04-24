Engine.instance.load().finally(async () => {
    await ActiveLocalization.instance.determineForSite(document.body.innerText);
    await Detector.instance.updateSharedLocalizations();

    const allElements = Detector.instance.detectAllElements(document.body);

    const elements = [];
    for (let element of allElements) {
        element.updateSnapshot()
        const r = await Detector.instance.detectResult(element._original.texts.join(' '))
        if (r.length > 0) elements.push(element);
    }

    const currency = Configuration.instance.currency.tag.value;
    elements.forEach(element => element.convertTo(currency));

    Detector.instance.updateSharedLocalizations();
    chrome.runtime.onMessage.addListener(async function (data, sender, senderResponse) {
        switch (data.type) {
            case 'getHref':
                senderResponse({success: true, data: Browser.instance.href});
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