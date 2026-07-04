import { RateResponse } from '../src/infrastructure'
import { Localizations } from '../src/currencyConverter/Localization'
import useMockContainer from './Container.mock'
import { HtmlMock } from './Html.mock'

const symbols = async () =>
    Localizations.currencySymbols.reduce((all, tag) => {
        all[tag] = tag
        return all
    }, {} as Record<string, string>)

const rate = async (from: string, to: string): Promise<RateResponse> => ({
    from,
    to,
    rate: 1,
    path: [],
    timestamp: Date.now(),
})

function normalize(text: string | null): string {
    return (text || '').replace(/\s+/g, ' ').trim()
}

describe('GitHub issue examples', () => {
    describe('Text snippets from reported pages', () => {
        const tests = [
            {
                name: '#82 The Verge decimal billion amount',
                html: `<p>Apple reported revenue of $102.5 billion for the quarter.</p>`,
                expect: [{currency: 'USD', amounts: [102.5]}],
            },
            {
                name: '#83 PlayStation Store Ukraine spaced four-digit price',
                html: `<span data-qa="mfeCtaMain#offer0#finalPrice">1 799,00 ₴</span>`,
                expect: [{currency: 'UAH', amounts: [1799]}],
            },
            {
                name: '#83 does not prepend a previous decimal when expanding spaced prices',
                html: `<span>Rating 4.5 1 799,00 ₴</span>`,
                expect: [{currency: 'UAH', amounts: [1799]}],
            },
            {
                name: '#81 Nanodog Namibian dollar prefix',
                html: `<span class="price">N$ 6,999.00</span>`,
                expect: [{currency: 'NAD', amounts: [6999]}],
            },
            {
                name: '#78 spaced number before currency',
                html: `<span>1 880 USD</span>`,
                expect: [{currency: 'USD', amounts: [1880]}],
            },
            {
                name: '#27 tilde before trailing currency',
                html: `<span>~250$</span>`,
                expect: [{currency: 'USD', amounts: [250]}],
            },
            {
                name: '#22 GitHub license text is not a currency amount',
                html: `<span>BSD 2-Clause license</span>`,
                expect: [],
            },
        ]

        tests.forEach(test => it(test.name, async () => {
            const {activeLocalization, textFlat} = useMockContainer({
                backendApi: {symbols},
            })
            await activeLocalization.load()
            await activeLocalization.overload({dollar: 'USD'})

            const actual = textFlat.find(HtmlMock.parseText(test.html))
                .map(({currency, amounts}) => ({currency, amounts}))

            expect(actual).toEqual(test.expect)
        }))

        it('#81 excludes N$ when NAD is disabled', async () => {
            const {activeLocalization, currencyTagConfig, textFlat} = useMockContainer({
                backendApi: {symbols},
            })
            currencyTagConfig.disabled.setValue(['NAD'])
            await activeLocalization.load()

            expect(textFlat.find(HtmlMock.parseText(`<span>N$ 6,999.00</span>`))).toEqual([])
        })

        it('fullwidth yen follows yen/CNY localization', async () => {
            const {activeLocalization, textFlat} = useMockContainer({
                backendApi: {symbols},
            })
            await activeLocalization.load()

            await activeLocalization.overload({yen: 'JPY'})
            expect(textFlat.find(HtmlMock.parseText(`<span>￥1,000</span>`))[0].currency).toBe('JPY')

            await activeLocalization.overload({yen: 'CNY'})
            expect(textFlat.find(HtmlMock.parseText(`<span>￥1,000</span>`))[0].currency).toBe('CNY')
        })
    })

    describe('Copied HTML snippets from issue #79', () => {
        const tests = [
            {
                name: 'Purchased items',
                html: `
                    <div class="price-mod__price___3Un7c" data-reactid=".0.7:$order-2529336253940086074.$2529336253940086074.0.1:1:0.$0.$4.0.0">
                        <p data-reactid=".0.7:$order-2529336253940086074.$2529336253940086074.0.1:1:0.$0.$4.0.0.2">
                            <strong data-reactid=".0.7:$order-2529336253940086074.$2529336253940086074.0.1:1:0.$0.$4.0.0.2.0">
                                <span data-reactid=".0.7:$order-2529336253940086074.$2529336253940086074.0.1:1:0.$0.$4.0.0.2.0.0">￥</span>
                                <span data-reactid=".0.7:$order-2529336253940086074.$2529336253940086074.0.1:1:0.$0.$4.0.0.2.0.1" data-spm-anchor-id="a1z09.2.0.i1.bd6a2e8dnrcDXX">108.75</span>
                            </strong>
                        </p>
                    </div>`,
                expect: ['110 USD'],
            },
            {
                name: 'Recent views',
                html: `
                    <div class="price--P4FG9Ynm">
                        <div class="unit--GutkPCAU">￥</div>
                        <div class="priceNum--e2VG97Rb" data-spm-anchor-id="tbpc.mytb_index.frequent.i1.6db24600wNel6l">273</div>
                        <div class="tag--_8OQ4R6i">近期浏览</div>
                    </div>`,
                expect: ['270 USD 近期浏览'],
            },
            {
                name: 'Shopping cart',
                html: `
                    <div class="trade-price-container type-of-12-14B-16B  " style="color: rgb(255, 80, 0);">
                        <span class="trade-price-symbol ">￥</span>
                        <span class="trade-price-integer " data-spm-anchor-id="a1z0d.6639537/202410.0.i0.5f307484QAyDuB">43</span>
                        <span class="trade-price-label ">券后价</span>
                    </div>`,
                expect: ['43 USD 券后价'],
            },
            {
                name: 'Shopping cart total',
                html: `
                    <div class="trade-price-container type-of-14-16B-24B  label-mr-4" style="color: rgb(255, 80, 0);">
                        <span class="trade-price-symbol ">￥</span>
                        <span class="trade-price-integer " data-spm-anchor-id="a1z0d.6639537/202410.0.i2.5f307484QAyDuB">314</span>
                        <span class="trade-price-point ">.</span>
                        <span class="trade-price-decimal ">94</span>
                    </div>`,
                expect: ['310 USD'],
            },
            {
                name: 'Converted total rows stay ignored',
                html: `
                    <div class="trade-price-container type-of-14B-14B-16B label-mr-4 uacc-clickable" style="color: rgb(31, 31, 31);" uacc:watched="true">
                        <span class="trade-price-symbol "></span>
                        <span class="trade-price-integer ">382</span>
                        <span class="trade-price-point "></span>
                        <span class="trade-price-decimal "></span>
                    </div>`,
                expect: [],
            },
        ]

        tests.forEach(test => it(test.name, async () => {
            const {activeLocalization, elementDetector} = useMockContainer({
                backendApi: {symbols, rate},
            })
            await activeLocalization.load()
            await activeLocalization.overload({yen: 'CNY'})

            const elements = await elementDetector.find(HtmlMock.parse(test.html))
            await Promise.all(elements.map(element => element.convertTo('USD')))
            await Promise.all(elements.map(element => element.showConverted()))

            expect(elements.map(element => normalize(element.element.textContent))).toEqual(test.expect)
        }))
    })

    it('#29 keeps a terminal dot outside the converted amount', async () => {
        const {activeLocalization, currencyElement} = useMockContainer({
            backendApi: {symbols, rate},
        })
        await activeLocalization.load()
        await activeLocalization.overload({dollar: 'USD'})

        const element = currencyElement.create(HtmlMock.parse(`<span>$50.</span>`))
        await element.convertTo('USD')

        // @ts-ignore
        expect(element.converted.texts.join(' ')).toBe('50 USD.')
    })
})
