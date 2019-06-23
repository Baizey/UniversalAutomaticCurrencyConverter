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
        const expected = true;

        // Act
        const actual = black.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

    it('base', () => {
        // Setup
        const url = base;
        const expected = true;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });
    it('www', () => {
        // Setup
        const url = www + base;
        const expected = true;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

    it('http', () => {
        // Setup
        const url = http + base;
        const expected = true;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

    it('https', () => {
        // Setup
        const url = https + base;
        const expected = true;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

    it('http www', () => {
        // Setup
        const url = http + www + base;
        const expected = true;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

    it('https wwww', () => {
        // Setup
        const url = https + www + base;
        const expected = true;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

    it('wrong', () => {
        // Setup
        const url = random;
        const expected = false;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });
    it('http wrong', () => {
        // Setup
        const url = http + random;
        const expected = false;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });
    it('https wrong', () => {
        // Setup
        const url = https + random;
        const expected = false;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });
    it('www wrong', () => {
        // Setup
        const url = www + random;
        const expected = false;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });
    it('http www wrong', () => {
        // Setup
        const url = http + www + random;
        const expected = false;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });
    it('https www wrong', () => {
        // Setup
        const url = https + www + random;
        const expected = false;

        // Act
        const actual = blacklist.isBlacklisted(url);

        // Assert
        expect(actual).toBe(expected);
    });

});