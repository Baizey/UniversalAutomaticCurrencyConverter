describe("Utility tests", () => {

    it("Safe number", () => {
        // Setup
        const number = 1000.5;
        const expected = true;

        // Act
        const actual = Utils.isSafeNumber(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Unsafe infinity number", () => {
        // Setup
        const number = Infinity;
        const expected = false;

        // Act
        const actual = Utils.isSafeNumber(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("Unsafe NaN number", () => {
        // Setup
        const number = NaN;
        const expected = false;

        // Act
        const actual = Utils.isSafeNumber(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("isDefined null test", () => {
        // Setup
        const number = null;
        const expected = false;

        // Act
        const actual = Utils.isDefined(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("isDefined undefined test", () => {
        // Setup
        const number = undefined;
        const expected = false;

        // Act
        const actual = Utils.isDefined(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("isDefined 0 test", () => {
        // Setup
        const number = 0;
        const expected = true;

        // Act
        const actual = Utils.isDefined(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("isUndefined null test", () => {
        // Setup
        const number = null;
        const expected = true;

        // Act
        const actual = Utils.isUndefined(number);

        // Assert
        expect(actual).toBe(expected);
    });


    it("isUndefined undefined test", () => {
        // Setup
        const number = undefined;
        const expected = true;

        // Act
        const actual = Utils.isUndefined(number);

        // Assert
        expect(actual).toBe(expected);
    });

    it("isUndefined 0 test", () => {
        // Setup
        const number = 0;
        const expected = false;

        // Act
        const actual = Utils.isUndefined(number);

        // Assert
        expect(actual).toBe(expected);
    });
});