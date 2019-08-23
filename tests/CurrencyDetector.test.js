describe("CurrencyDetector tests", () => {
    const browser = Browser.instance({
        type: Browsers.Chrome,
        access: null
    });

    it("Expect only currency correct", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        const data = '5 USD';
        const expected = [new SearchResult(data, '', '', ' ', '', 5, 'USD', 0)];

        // Act
        const actual = detector.findAll(data, true);

        // Assert
        expect(actual).toBeDefined();
        expect(actual).toEqual(expected);
    });

    it("Expect only currency wrong", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        const data = '5 USD is cool';

        // Act
        const actual = detector.findAll(data, true);

        // Assert
        expect(actual).toEqual([]);
    });

    it("Detects japanse currency with symbol", () => {
        // Setup
        const detector = new CurrencyDetector(
            Browser.instance({
                type: Browsers.Chrome,
                access: null
            }));
        detector.localize('jp');

        const data = 'JP¥5';
        const expected = [new SearchResult(data, '', '', '', '', 5, 'JPY', 0)];

        // Act
        const actual = detector.findAll(data, true);

        // Assert
        expect(actual).toEqual(expected);
    });

    it("Test scandinavian special currency", () => {
        // Setup
        const detector = new CurrencyDetector(
            Browser.instance({
                type: Browsers.Chrome,
                access: null
            }));
        detector.localize('dk');

        const data = '5,-';
        const expected = [new SearchResult(data, '', '', '', '', 5, 'DKK', 0)];

        // Act
        const actual = detector.findAll(data, true);

        // Assert
        expect(actual).toEqual(expected);
    });

    // TODO: make it handle this with both values being seen as USD
    it("Test X-Y currency", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        const data = '5-10 USD';
        const expected = [
            new SearchResult(data, '', '', ' ', '', [5, 10], 'USD', 0),
        ];

        // Act
        const actual = detector.findAll(data);

        // Assert
        expect(actual).toEqual(expected);
    });

    it("Test amazon.co.uk", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        detector.localize('uk');
        const data = "£2\n.\n49";
        const expected = [new SearchResult(data, '', '', '', '', [2.49], 'GBP', 0)];

        // Act
        const actual = detector.findAll(data, true);

        // Assert
        expect(actual).toEqual(expected);
    });

    it("String without currency does not contain currency", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        const data = "5";
        const expected = false;

        // Act
        const actual = detector.contains(data);

        // Assert
        expect(actual).toEqual(expected);
    });

    it("Detect currencies side by side", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        const data = "5 USD 5 USD";
        const expected = [
            new SearchResult('5 USD ', '', '', ' ', ' ', 5, 'USD', 0),
            new SearchResult(' 5 USD', ' ', '', ' ', '', 5, 'USD', 5),
        ];

        // Act
        const actual = detector.findAll(data, false);

        // Assert
        expect(actual).toEqual(expected);
    });

    it("Odd test", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        detector.localize();
        const data = ' $31)';
        const expected = [new SearchResult(data, ' ', '', '', ')', 31, 'USD', 0)];

        // Act
        const actual = detector._regex.exec(data);

        // Assert
        expect(actual).toEqual(expected);

    });

    it("Detect small numbers", () => {
        // Setup
        const detector = new CurrencyDetector(browser);
        const data = "0.000573USD";
        const expected = [new SearchResult(data, '', '', '', '', 0.000573, 'USD', 0)];

        // Act
        const actual = detector.findAll(data, true);

        // Assert
        expect(actual).toEqual(expected);
    });
});