describe('Localization tests', () => {

    it("Pick sek over dkk using text", () => {
        // Setup
        const local = new Localization();
        const currencies = {
            'DKK': 'DKK',
            'SEK': 'SEK'
        };
        const text = 'SEK SEK SEK MOTHERFUCKER';
        const expected = {
            'kr': 'SEK',
            'kr.': 'SEK',
            ',-': 'SEK',
        };

        // Act
        local.analyze(currencies, text);

        // Assert
        expect(currencies['kr']).toBe('SEK');
        expect(currencies['kr.']).toBe('SEK');
        expect(currencies[',-']).toBe('SEK');
    });

    it("Pick dkk over sek due to domain", () => {
        // Setup
        const local = new Localization();
        const currencies = {
            'DKK': 'DKK',
            'SEK': 'SEK'
        };
        const text = 'SEK SEK SEK MOTHERFUCKER';
        const expected = {
            'kr': 'SEK',
            'kr.': 'SEK',
            ',-': 'SEK',
        };

        // Act
        local.analyze(currencies, text, 'dk');

        // Assert
        expect(currencies['kr']).toBe('DKK');
        expect(currencies['kr.']).toBe('DKK');
        expect(currencies[',-']).toBe('DKK');
    });

});