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

describe('Integration tests', () => {

    /*
    it('fixer-middle-endpoint/api/rates', async () => {
        const url = 'https://fixer-middle-endpoint.azurewebsites.net/api/v2/rates/';

        const actual = await Ajax.get(url).then(e => JSON.parse(e));

        expect(actual).toBeTruthy();
        expect(actual.success).toBeTruthy();
    });

    it('fixer-middle-endpoint/api/symbols', async () => {
        const url = 'https://fixer-middle-endpoint.azurewebsites.net/api/v2/symbols/';

        const actual = await Ajax.get(url).then(e => JSON.parse(e));

        expect(actual).toBeTruthy();
        expect(actual.success).toBeTruthy();
    });
     */
});