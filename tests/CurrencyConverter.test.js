describe("CurrencyConverter tests", () => {
    const converter = new CurrencyConverter();

    beforeEach(() => {
        converter
            .withBaseCurrency('A')
            .withConversionRatesBase('A')
            .withConversionRates({
                'A': 1,
                'B': 2,
                'C': 0.5
            });
    });

    it("Same currency but not in list", () => {
        // Setup
        converter.withConversionRates({
            'B': 2,
            'C': 0.5
        });
        const amount = 5;
        const currency = 'A';
        const expected = amount;

        // Act
        const actual = converter.convert(amount, currency);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Same currency", () => {
        // Setup
        const amount = 5;
        const currency = 'A';
        const expected = amount;

        // Act
        const actual = converter.convert(amount, currency);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Higher rate currency", () => {
        // Setup
        const amount = 5;
        const currency = 'B';
        const expected = amount / 2;

        // Act
        const actual = converter.convert(amount, currency);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Lower rate currency", () => {
        // Setup
        const amount = 5;
        const currency = 'C';
        const expected = amount * 2;

        // Act
        const actual = converter.convert(amount, currency);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Unknown rate currency", () => {
        // Setup
        const amount = 5;
        const currency = 'uihruig';
        const expected = amount;

        // Act
        const actual = converter.convert(amount, currency);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Different rate base", () => {
        converter.withConversionRatesBase('B');
        // Setup
        const amount = 5;
        const currency = 'C';
        const expected = amount * 2;
        // Act
        const actual = converter.convert(amount, currency);

        // Assert
        expect(actual).toBe(expected);
    });

});