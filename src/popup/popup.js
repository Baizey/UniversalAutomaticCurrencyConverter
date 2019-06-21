let url;
const engine = new Engine();
const loader = engine.loadSettings();

document.addEventListener('DOMContentLoaded', () => {
    Browser.updateFooter();

    document.getElementById('showAll').addEventListener('click', () => {
        Browser.messageTab({
            method: 'convertAll',
            converted: true
        }).finally();
    });

    document.getElementById('hideAll').addEventListener('click', () => {
        Browser.messageTab({
            method: 'convertAll',
            converted: false
        }).finally();
    });

    Browser.messageTab({method: 'conversionCount'})
        .then(resp => document.getElementById('conversionCount').innerText = Utils.isDefined(resp) ? resp : 0);

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