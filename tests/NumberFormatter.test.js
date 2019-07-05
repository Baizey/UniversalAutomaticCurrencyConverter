const formattingData = [
    {input: 1000.5, expect: '1.000,5'},
    {input: 0.4734, expect: '0,4734'},
    {input: 0, expect: '0'},
    {input: 475843, expect: '475.843'},
];
const formatTitle = data => `${data.input} -> ${data.expect}`;
const formatTest = data => {
    // Setup
    const formatter = new NumberFormatter().withThousand('.').withDecimal(',');
    const number = data.input;
    const expected = data.expect;

    // Act
    const actual = formatter.format(number);

    // Assert
    expect(actual).toBe(expected);
};

const roundingData = [
    {input: 0, expect: 0, rounding: 1},
    {input: 2, expect: 2, rounding: 1},
    {input: 52.6, expect: 50, rounding: 1},
    {input: 5.52, expect: 6, rounding: 1},
    {input: 5.55, expect: 6, rounding: 1},
    {input: 5489, expect: 5000, rounding: 1},
    {input: 0.505, expect: 0.5, rounding: 1},

    {input: 0.99, expect: 1, rounding: 2},
    {input: 99, expect: 100, rounding: 2},
    {input: 95, expect: 100, rounding: 2},
    {input: 14, expect: 14, rounding: 2},
    {input: 19, expect: 20, rounding: 2},
    {input: 0.000001, expect: 0.000001, rounding: 2},
    {input: 0.0000001, expect: 0, rounding: 2},
    {input: 0, expect: 0, rounding: 2},
    {input: 2, expect: 2, rounding: 2},
    {input: 7.467600002761219, expect: 7.5, rounding: 2},
    {input: 52.6, expect: 53, rounding: 2},
    {input: 5.52, expect: 5.5, rounding: 2},
    {input: 5.55, expect: 5.6, rounding: 2},
    {input: 5489, expect: 5500, rounding: 2},
    {input: 0.505, expect: 0.51, rounding: 2},

    {input: 0, expect: 0, rounding: 3},
    {input: 52.6, expect: 52.6, rounding: 3},
    {input: 5.52, expect: 5.52, rounding: 3},
    {input: 5.55, expect: 5.55, rounding: 3},
    {input: 5489, expect: 5490, rounding: 3},
    {input: 0.505, expect: 0.51, rounding: 3},
    {input: 0.00005555, expect: 0.000056, rounding: 3},

    {input: 5.0000000100, expect: 5, rounding: 5},
    {input: 534848975435.5478, expect: 534848975400, rounding: 10},
    {input: 11.11111111111111111, expect: 11.11, rounding: 10},
    {input: 53448.5478, expect: 53448.55, rounding: 10},
];
const roundingTitle = data => `${data.input} -> ${data.expect} (${data.rounding} digits)`;
const roundingTest = data => {
    // Setup
    const formatter = new NumberFormatter().withRounding(data.rounding);
    const number = data.input;
    const expected = data.expect;

    // Act
    const actual = formatter.round(number);

    // Assert
    expect(actual).toBe(expected);
};

const completeTest = (data, title, test) => it(title(data), () => test(data));

const completeTests = (mainTitle, data, subtitle, test) => {
    describe(mainTitle, () => data.forEach(subdata => it(subtitle(subdata), () => test(subdata))));
};

describe("NumberFormatter tests", () => {
    completeTests('Formatting', formattingData, formatTitle, formatTest);
    completeTests('Rounding', roundingData, roundingTitle, roundingTest);
});