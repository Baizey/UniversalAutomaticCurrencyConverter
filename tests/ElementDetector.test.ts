import useMockContainer from './Container.mock'
import {HtmlMock} from './Html.mock'

describe('ElementDetector', () => {
    const originalShowTest = [
        {
            name: 'aliexpress is bad and it should feel bad',
            element: HtmlMock.parse(`<div class="es--wrap--2p8eS4Q notranslate" style="color: rgb(51, 51, 51); font-size: 20px;" id="aaaa"><span class="es--char--1Qcd3D7">DKK</span><span class="es--space2--2NEE6dI"></span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i5.6c4738dar3W1U8">1</span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i7.6c4738dar3W1U8">4</span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i0.6c4738dar3W1U8">5</span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i4.6c4738dar3W1U8">.</span><span class="es--char--1Qcd3D7">8</span><span class="es--char--1Qcd3D7">9</span></div>`),
            expect: ["DKK145.89"]
        },
        {
            name: 'Amazon one original',
            element: HtmlMock.parse(
                `<span class="a-price" data-a-size="l" data-a-color="base"><span class="a-offscreen">DKK&nbsp;21.44</span><span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span></span>`,
            ),
            expect: ['DKK 21.44', 'DKK21.44'],
        },
        {
            name: 'Amazon hidden original',
            element: HtmlMock.parse(
                `<span class="a-offscreen">DKK&nbsp;21.44</span>`,
            ),
            expect: ['DKK 21.44'],
        },
        {
            name: 'Amazon visible original',
            element: HtmlMock.parse(
                `<span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span>`,
            ),
            expect: ['DKK21.44'],
        },
    ]

    originalShowTest.forEach(
        (test: { name: string; element: HTMLElement; expect: any }) => {
            it(`${test.name}`, async () => {
                // Setup
                const provider = useMockContainer({
                    backendApi: {
                        symbols: async () => Promise.resolve({
                            DKK: 'DKK',
                            USD: 'USD',
                            EUR: 'EUR'
                        }),
                    },
                })
                const elementDetector = provider.elementDetector
                await elementDetector.textDetector.activeLocalization.load()
                await elementDetector.textDetector.activeLocalization.overload({dollar: 'USD'})

                // Act
                const actual = await elementDetector.find(test.element)
                await Promise.all(actual.map((e) => e.showOriginal()))

                // Assert
                expect(actual.map((e) => e.element.textContent).sort()).toEqual(
                    test.expect.sort(),
                )
            })
        },
    )

    const convertedShowTest = [
        {
            name: 'Amazon one converted',
            element: HtmlMock.parse(
                `<span class="a-price" data-a-size="l" data-a-color="base"><span class="a-offscreen">DKK&nbsp;21.44</span><span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span></span>`,
            ),
            expect: ['21 DKK', '21 DKK'],
        },
        {
            name: 'Amazon hidden converted',
            element: HtmlMock.parse(
                `<span class="a-offscreen">DKK&nbsp;21.44</span>`,
            ),
            expect: ['21 DKK'],
        },
        {
            name: 'Amazon visible converted',
            element: HtmlMock.parse(
                `<span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span>`,
            ),
            expect: ['21 DKK'],
        },
        {
            name: 'Spaced numerals',
            element: HtmlMock.parse(`<div>2 400 000 DKK</div>`),
            expect: ['2 400 000 DKK'],
        },
    ]
    convertedShowTest.forEach(
        (test: { name: string; element: HTMLElement; expect: string[] }) => {
            it(`${test.name}`, async () => {
                // Setup
                const {activeLocalization, elementDetector} = useMockContainer({
                    backendApi: {
                        rate: (from: string, to: string) => Promise.resolve({
                            from, to,
                            rate: 1,
                            path: [],
                            timestamp: Date.now(),
                            isExpired: false,
                        }),
                        symbols: () => Promise.resolve({
                            DKK: 'DKK',
                            USD: 'USD',
                        }),
                    }
                })
                await activeLocalization.load()
                await activeLocalization.overload({
                    dollar: 'USD',
                    krone: 'DKK',
                })

                // Act
                const actual = await elementDetector.find(test.element)
                await Promise.all(actual.map((e) => e.convertTo('DKK')))
                await Promise.all(actual.map((e) => e.showConverted()))

                // Assert
                expect(actual.map((e) => e.element.textContent).sort()).toEqual(
                    test.expect.sort(),
                )
            })
        },
    )
})
