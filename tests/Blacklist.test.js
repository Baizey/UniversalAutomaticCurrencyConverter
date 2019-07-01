describe('Blacklisting tests', () => {
    const blacklist = new Blacklist();
    const random = 'amazon.de';
    const base = 'amazon.co.uk';
    const http = 'http://';
    const https = 'https://';
    const www = 'www.';
    blacklist.withUrl(base);

    it('base 2', () => {
        // Setup
        const black = new Blacklist();
        black.withUrls([base, random]);

        // Act
        black.whitelist(base);

        // Assert
        expect(black.urls).toEqual([random]);
    });

    it('base 2', () => {
        // Setup
        const black = new Blacklist();
        black.withUrl(https + www + base);
        const url = base;


        // Act
        const actual = black.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });

    it('base', () => {
        // Setup
        const url = base;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });
    it('www', () => {
        // Setup
        const url = www + base;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });

    it('http', () => {
        // Setup
        const url = http + base;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });

    it('https', () => {
        // Setup
        const url = https + base;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });

    it('http www', () => {
        // Setup
        const url = http + www + base;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });

    it('https wwww', () => {
        // Setup
        const url = https + www + base;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeTruthy();
    });

    it('wrong', () => {
        // Setup
        const url = random;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeNull();
    });
    it('http wrong', () => {
        // Setup
        const url = http + random;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeNull();
    });
    it('https wrong', () => {
        // Setup
        const url = https + random;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeNull();
    });
    it('www wrong', () => {
        // Setup
        const url = www + random;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeNull();
    });
    it('http www wrong', () => {
        // Setup
        const url = http + www + random;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeNull();
    });
    it('https www wrong', () => {
        // Setup
        const url = https + www + random;


        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBeNull();
    });

});