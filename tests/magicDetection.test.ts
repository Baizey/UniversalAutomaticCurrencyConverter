import {aliexpress_com_site, amazon_com_html_site, amazon_com_thing_site} from "./TestData.mock";
import useMockContainer from "./Container.mock";
import {Suite} from "benchmark";
import {RateApi} from "../src/serviceWorker/RateApi";
import {HtmlMock} from "./Html.mock";

const disabled = false
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

    const amazon_html = HtmlMock.parse(amazon_com_html_site)
    it('amazon_nested_html', async () => await nestedTest('amazon_nested_html', amazon_html))

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

async function nestedTest(name: string, node: HTMLElement) {
    const resp = await RateApi.fetch(`v4/symbols`).then(e => e.text()).then(JSON.parse)
    const {magicDetector, textDetector, activeLocalization} = useMockContainer({
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
    await magicDetector.load()

    const m = magicDetector.find(node.textContent!).map(e => e.text).map(e => `'${e.replace(/\s/g, ' ').trim()}'`)
    const t = textDetector.find(node.textContent!).map(e => e.text).map(e => `'${e.replace(/\s/g, ' ').trim()}'`)
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
        .add(name + " magic", () => {
            const queue: any[] = [node]
            let result = ''
            while (queue.length > 0) {
                const at = queue.pop()!
                result += magicDetector.find(at!.textContent ?? '');
                if (!at.children) continue
                for (let i = 0; i < at.children.length; i++) {
                    queue.push(at.children[i])
                }
            }
            return result
        })
        .add(name + " text", () => {
            const queue: any[] = [node]
            let result = ''
            while (queue.length > 0) {
                const at = queue.pop()!
                result += textDetector.find(at!.textContent ?? '');
                if (!at.children) continue
                for (let i = 0; i < at.children.length; i++) {
                    queue.push(at.children[i])
                }
            }
            return result
        })
        .add(name + " dream", () => {
            const queue: any[] = [node]
            let result = 0
            while (queue.length > 0) {
                const at = queue.pop()!
                const text = (at!.textContent) ?? ''
                const n = text.length
                for(let i = 0; i < n; i++) result = text.charCodeAt(i)
                if (!at.children) continue
                for (let i = 0; i < at.children.length; i++) {
                    queue.push(at.children[i])
                }
            }
            return result
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .run({async: false})
}

async function test(name: string, text: string) {
    const resp = await RateApi.fetch(`v4/symbols`).then(e => e.text()).then(e => JSON.parse(e))
    const { textDetector, magicDetector, activeLocalization} = useMockContainer({
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
        .add(name + " dream", () => {
            let a = 0
            const n = text.length
            for(let i = 0; i < n; i++) a = text.charCodeAt(i)
            return a
        })
        .on('cycle', (event: any) => console.log(String(event.target)))
        .run({async: false})
}