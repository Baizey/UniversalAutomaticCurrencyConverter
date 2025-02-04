import useMockContainer from "./Container.mock";


describe('textFlat', () => {
    const {textFlat} = useMockContainer({
        activeLocalization: {
            parseCurrency(raw: string) {
                return raw
            }
        }
    })

    type Matches = [string] | [string, number] | [string, number, string]

    const testsThatMatch: Matches[] = [
        // Small decimal numbers between 0 and 1
        ['$0.1', 0.1], ['$0.0000010000', 0.0000010000], ['$0,1', 0.1], ['$0,000001', 0.000001],
        // . grouped
        ["$1.000", 1_000], ["$10.000", 10_000], ["$100.000", 100_000], ["$1.000.000", 1_000_000],
        // , grouped
        ["$1,000", 1_000], ["$10,000", 10_000], ["$100,000", 100_000], ["$1,000,000", 1_000_000],
        // ungrouped
        ["$1000", 1_000], ["$10000", 10_000], ["$100000", 100_000], ["$1000000", 1_000_000],
        // , grouped . decimal
        ["$1,000.99", 1000.99], ["$10,000.99", 10_000.99], ["$100,000.99", 100_000.99], ["$1,000,000.99", 1_000_000.99],
        // . grouped , decimal
        ["$1.000,99", 1_000.99], ["$10.000,99", 10_000.99], ["$100.000,99", 100_000.99], ["$1.000.000,99", 1_000_000.99],
        // ungrouped . decimal
        ["$1000.99", 1_000.99], ["$10000.99", 10_000.99], ["$100000.99", 100_000.99], ["$1000000.99", 1_000_000.99],
        // ungrouped , decimal
        ["$1000,99", 1_000.99], ["$10000,99", 10_000.99], ["$100000,99", 100_000.99], ["$1000000,99", 1_000_000.99],
        // spaced . grouped , decimal
        ["$1    .     000\n\n.\t\t000 \t\n,\n\t99", 1_000_000.99],
        // Prioritize the closest grouped
        ["$ 1USD", 1, 'USD'],
        ["$1 USD", 1, '$'],
        // Only accept proper formats
        ["$1.000.0000", 1000000],
        ["$1.000,999", 1000.99]
    ]
    testsThatMatch.forEach(test => it('match ' + test, () => {
        const results = textFlat.find(test[0])
        if (test.length === 1) {
            expect(results.length).toBe(0)
        } else {
            const amount = results.flatMap(e => e.amounts)[0]
            expect(amount).toBe(test[1])
            if (test[2]) {
                const currency = results.map(e => e.currency)[0]
                expect(currency).toBe(test[2])
            }
        }
    }))
})