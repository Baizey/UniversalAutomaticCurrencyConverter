import useMockContainer from './Container.mock'
import {HtmlMock} from './Html.mock'
import {RateResponse} from "../src/infrastructure";
import {SymbolResponse} from "../src/infrastructure/BrowserMessengers/background/SymbolQuery";
import {Localizations} from "../src/currencyConverter/Localization";
import {RatesResponse} from "../src/infrastructure/BrowserMessengers/background/RateQuery";

describe('CurrencyElement', () => {
    const tests = [
        /* TODO: find a way to make this work
        {
            name: 'aliexpress',
            element: HtmlMock.parse(`<div class="es--wrap--2p8eS4Q notranslate" style="color: rgb(51, 51, 51); font-size: 20px;" id="aaaa"><span class="es--char--1Qcd3D7">USD</span><span class="es--space2--2NEE6dI"></span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i5.6c4738dar3W1U8">1</span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i7.6c4738dar3W1U8">4</span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i0.6c4738dar3W1U8">5</span><span class="es--char--1Qcd3D7" data-spm-anchor-id="a2g0o.cart.0.i4.6c4738dar3W1U8">.</span><span class="es--char--1Qcd3D7">8</span><span class="es--char--1Qcd3D7">9</span></div>`),
            expect: "150 USD"
        },
         */
        {
            name: 'amazon',
            expect: ' 4 USD  ',
            element: HtmlMock.parse(
                `<span aria-hidden="true" id="aaa"><span class="a-price-symbol">$</span><span class="a-price-whole">3<span class="a-price-decimal">.</span></span><span class="a-price-fraction">99</span></span>`,
            ),
        },
        {
            name: 'aliexpress',
            expect: '280 - 360 USD',
            element: HtmlMock.parse(
                `<span class="product-price-value uacc-clickable" itemprop="price" style="" data-spm-anchor-id="a2g0o.detail.1000016.i2.132937d7JS6Tjc">US $282.98 - 361.08</span>`,
            ),
        },
        {
            name: 'whitespace',
            expect: '\n        23 USD\n    ',
            element:
                HtmlMock.parse(`<span id="price_inside_buybox" class="a-size-medium a-color-price" style="">
        22,99&nbsp;USD
    </span>`),
        },
        {
            name: 'bracket range',
            expect: '5 - 5 USD (5 - 5 USD)',
            showInBrackets: true,
            element: HtmlMock.parse(`<div>5 - 5 USD</div>`),
        },
    ]
    tests.forEach(
        (test: {
            name: string;
            expect: string;
            element: HTMLElement;
            showInBrackets?: boolean;
        }) => {
            it(`${test.name}`, async () => {
                // Setup
                const {
                    activeLocalization,
                    currencyTagConfig,
                    currencyElement,
                } = useMockContainer({
                    backgroundMessenger: {
                        async getRates(from: string, to: string): Promise<RatesResponse> {
                            return {
                                rates: [{
                                    from,
                                    to,
                                    timestamp: Date.now(),
                                    rate: 1,
                                    path: []
                                }]
                            } as RatesResponse
                        },
                        async getSymbols(): Promise<SymbolResponse> {
                            return Localizations.currencySymbols.reduce((a, b) => {
                                a[b] = b;
                                return a
                            }, {}) as SymbolResponse
                        }
                    },
                })
                await activeLocalization.load()
                await activeLocalization.overload({dollar: 'USD'})
                currencyTagConfig.showConversionInBrackets.setValue(test.showInBrackets)
                const actual = currencyElement.create(test.element)

                // Act
                await actual.convertTo('USD')

                // Assert
                // @ts-ignore
                expect(actual.converted.texts.join(' ')).toBe(test.expect)
            })
        },
    )
})
