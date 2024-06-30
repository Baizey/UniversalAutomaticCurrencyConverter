import {aliexpress_com_site, amazon_com_thing_site} from "./TestData.mock";
import useMockContainer from "./Container.mock";
import {Suite} from "benchmark";
import {RateApi} from "../src/serviceWorker/RateApi";

const disabled = true
describe('magic benchmark', () => {
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


    const length = 100_000
    const obj = {}
    const map = new Map()
    const arr: any[] = []
    const arg = "arg"
    for (let i = 0; i < length; i++) {
        arr.push(true)
        map.set(arg + i, true)
        obj[arg + i] = true
    }
    it("", () => {
        new Suite()
            .add('arr', () => {
                let result = false
                for (let i = 0; i < length; i++) {
                    result ||= arr[i]
                }
                return result
            })
            .add('obj', () => {
                let result = false
                for (let i = 0; i < length; i++) {
                    result ||= obj[arg + i]
                }
                return result
            })
            .add('map', () => {
                let result = false
                for (let i = 0; i < length; i++) {
                    result ||= map.get(arg + i)
                }
                return result
            })
            .on('cycle', (event: any) => console.log(String(event.target)))
            .run({async: false})
    })

})

async function test(name: string, text: string) {
    const resp = await RateApi.fetch(`v4/symbols`).then(e => e.text()).then(e => JSON.parse(e))
    const {magicDetector, textDetector, activeLocalization} = useMockContainer({
        backendApi: {symbols: () => Promise.resolve(resp)},
        metaConfig: {logging: {}},
        logger: {
            info(data: string) {
            },
        },
        currencyTagConfig: {
            disabled: {
                get value() {
                    return []
                }
            }
        },
    })
    await activeLocalization.load()
    await magicDetector.load()

    const m = magicDetector.find(text).map(e => e.text).map(e => `'${e.replace(/\s/g, ' ').trim()}'`)
    const t = textDetector.find(text).map(e => e.text).map(e => `'${e.replace(/\s/g, ' ').trim()}'`)
    const diff: string[] = []
    for (let i = 0; i < Math.min(m.length, t.length); i++) {
        if (m[i].length < t[i].length) {
            m[i] += ' '.repeat(t[i].length - m[i].length)
        } else if (m[i].length > t[i].length) {
            t[i] += ' '.repeat(m[i].length - t[i].length)
        }
        if (m[i] !== t[i]) {
            diff.push('-'.repeat(m[i].length))
        } else {
            diff.push(' '.repeat(m[i].length))
        }
    }
    console.log(`\n${m.length}: ${m.join(', ')}\n${diff.length}: ${diff.join(', ')}\n${t.length}: ${t.join(', ')}`)

    new Suite()
        .add(name + " magic", () => magicDetector.find(text))
        .add(name + " text", () => textDetector.find(text))
        .on('cycle', (event: any) => console.log(String(event.target)))
        .run({async: false})
}