import {aliexpress_com_site, amazon_com_thing_site} from "./TestData.mock";
import useMockContainer from "./Container.mock";
import {Suite} from "benchmark";
import {RateApi} from "../src/serviceWorker/RateApi";

const disabled = true
describe('benchmark', () => {
    if (disabled) {
        it('dummy', () => expect(true).toBeTruthy())
        return
    }
    const size = 8000

    function scale(txt: string) {
        const scale = size / txt.length
        return txt.repeat(scale)
    }

    const realistic = scale(' €1 for 3 of these US items')
    it('realistic', async () => await test('realistic', realistic))

    const almost = scale('12345USA')
    it('almost', async () => await test('almost', almost))

    const match = scale('12345USD ')
    it('match', async () => await test('match', match))

    const numbers = scale('12345678')
    it('numbers', async () => await test('numbers', numbers))

    const randomText = scale('ruhgheri')
    it('randomText', async () => await test('randomText', randomText))

    const whitespace = scale('        ')
    it('whitespace', async () => await test('whitespace', whitespace))

    const strange = scale('€€€€€€€€')
    it('strange', async () => await test('strange', strange))

    const amazon = amazon_com_thing_site
    it('amazon', async () => await test('amazon', amazon))

    const aliexpress = aliexpress_com_site
    it('aliexpress', async () => await test('aliexpress', aliexpress))
})

async function test(name: string, text: string) {
    const resp = await RateApi.fetch(`v4/symbols`).then(e => e.text()).then(e => JSON.parse(e))
    const {textDetector, activeLocalization} = useMockContainer({
        backendApi: {symbols: () => Promise.resolve(resp)},
        metaConfig: {logging: {}},
        currencyTagConfig: {
            disabled: {
                get value() {
                    return []
                }
            }
        },
    })
    await activeLocalization.load()

    new Suite()
        .add(name + " text", () => textDetector.find(text))
        .add(name + " dream", () => {
            let a = 0
            const n = text.length
            for (let i = 0; i < n; i++) a = text.charCodeAt(i)
            return a
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .run({async: false})
}