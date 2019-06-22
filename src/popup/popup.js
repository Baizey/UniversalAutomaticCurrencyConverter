let url;
const engine = new Engine();
const loader = engine.loadSettings();

document.addEventListener('DOMContentLoaded', () => {
    Browser.updateFooter();

    const hideButton = document.getElementById('hideConversions');
    let isConverted = false;
    hideButton.addEventListener('click', () => {
        Browser.messageTab({
            method: 'convertAll',
            converted: isConverted
        }).finally();
        hideButton.innerText = isConverted ? 'Hide conversions' : 'Show conversions';
        hideButton.classList.remove(isConverted ? 'btn-success' : 'btn-danger');
        hideButton.classList.add(isConverted ? 'btn-danger' : 'btn-success');
        isConverted = !isConverted;
    });

    Browser.messageTab({method: 'conversionCount'})
        .then(resp => document.getElementById('conversionCount').value = (Utils.isDefined(resp) ? resp : 0) + ' conversions');

    [
        {symbol: '$', id: 'dollar'},
        {symbol: 'kr', id: 'kroner'},
        {symbol: '¥', id: 'asian'},
    ].forEach(data => Browser.messageTab({method: 'getLocalization', symbol: data.symbol})
        .then(resp => document.getElementById(data.id).value = Utils.isDefined(resp) ? resp : '?')
        .then(() => document.getElementById(data.id))
        .then(selector => selector.addEventListener('change', () => {
            const value = selector.children[selector.selectedIndex].value;
            Browser.messageTab({method: 'setLocalization', symbol: data.symbol, to: value}).finally();
        })));

    const loadingUrl = Browser.messageTab({method: 'getUrl'})
        .then(resp => {
            if (!resp) return;
            if (typeof resp !== 'string') return;
            resp = resp.replace(/^(https?:\/\/)?(www\.)?/, '');
            return resp.split('/')[0];
        });

    loader.finally(async () => {
        url = await loadingUrl;
        const blacklist = engine.blacklist;
        if (!url)
            document.getElementById('blacklist').remove();
        else {
            document.getElementById('blacklistInput').value = url;
            const button = document.getElementById('blacklistButton');
            const isBlacklisting = !blacklist.isBlacklisted(url);
            button.innerText = isBlacklisting ? 'Blacklist' : 'Whitelist';
            button.classList.remove(isBlacklisting ? 'btn-success' : 'btn-danger');
            button.classList.add(isBlacklisting ? 'btn-danger' : 'btn-success');

            button.addEventListener('click', async () => {
                const isBlacklisting = blacklist.isBlacklisted(url);
                const button = document.getElementById('blacklistButton');
                button.innerText = isBlacklisting ? 'Blacklist' : 'Whitelist';
                button.classList.remove(isBlacklisting ? 'btn-success' : 'btn-danger');
                button.classList.add(isBlacklisting ? 'btn-danger' : 'btn-success');
                if (!isBlacklisting) blacklist.withUrls(url);
                else blacklist.whitelist(url);
                await Browser.save('blacklistingurls', blacklist.urls);
            });
        }

    });

    /*
    chrome.runtime.onMessage.addListener(function (request, sender, senderResponse) {
        senderResponse({success: true});
        return true;
    });
    */
});