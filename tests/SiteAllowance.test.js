describe('SiteAllowance', () => {

    const tests = [
        {whitelist: true, blacklist: true, allowed: [], disallowed: [], url: 'http://google.com', expect: true},
        {
            whitelist: false,
            blacklist: true,
            allowed: [],
            disallowed: [],
            url: 'http://mail.google.com/stuff',
            expect: true
        },
        {
            whitelist: false,
            blacklist: false,
            allowed: [],
            disallowed: [],
            url: 'http://mail.google.com/stuff',
            expect: true
        },
        {
            whitelist: true,
            blacklist: false,
            allowed: [],
            disallowed: [],
            url: 'http://mail.google.com/stuff',
            expect: false
        },
        {
            whitelist: true,
            blacklist: true,
            allowed: ['http://mail.google.com'],
            disallowed: ['http://google.com'],
            url: 'http://mail.google.com/stuff',
            expect: true
        },
        {
            whitelist: true,
            blacklist: true,
            allowed: ['http://google.com'],
            disallowed: ['http://mail.google.com'],
            url: 'http://mail.google.com/stuff',
            expect: false
        },
        {
            whitelist: false,
            blacklist: true,
            allowed: ['http://mail.google.com'],
            disallowed: ['http://google.com'],
            url: 'http://mail.google.com/stuff',
            expect: false
        },
        {
            whitelist: true,
            blacklist: false,
            allowed: ['http://google.com'],
            disallowed: ['http://mail.google.com'],
            url: 'http://mail.google.com/stuff',
            expect: true
        },
    ];

    tests.forEach(test => it(`whitelist: ${test.whitelist}, blacklist: ${test.blacklist}, url: ${test.url}, expect: ${test.expect}`, () => {
        // Setup
        const config = new Configuration();
        config.blacklist.using.setValue(test.blacklist);
        config.blacklist.urls.setValue(test.disallowed);
        config.whitelist.using.setValue(test.whitelist);
        config.whitelist.urls.setValue(test.allowed);
        const allowance = new SiteAllowance({config: config});
        allowance.updateFromConfig();

        // Act
        const actual = allowance.isAllowed(test.url);

        // Assert
        expect(actual).toEqual(test.expect);
    }));
});