import {amazon_com_html_site} from "./TestData.mock";
import useMockContainer from "./Container.mock";
import {Suite} from "benchmark";
import {RateApi} from "../src/serviceWorker/RateApi";
import {HtmlMock} from "./Html.mock";

const disabled = true
describe('benchmark', () => {
    if (disabled) {
        it('dummy', () => expect(true).toBeTruthy())
        return
    }

    it('amazon_html', async () => await testHtml('amazon_html', amazon_com_html_site))

    it('simple', async () => await testHtml('simple', `
<div>5 , 10$</div>
<div><div><div><div>5</div><div>.</div><div>0</div><div>USD</div></div></div></div>
<div>$4$4</div>
<div>$4.$4</div>
<div>I like 5. $ is bad</div>
<div>I like $ 5-10 to be money</div>
<div>cake$534798heruiygfh</div>
<div>aaaa 5.000,20$ aaaa</div>
<div>aaaa 5,000.20$ aaaa</div>
<div>I want $5. 0 dollar is not ok</div>
`))
})

async function testHtml(name: string, text: string) {
    const {pseudoFlat, textFlat, pseudoDetector, textDetector, activeLocalization, pseudoDom} = useMockContainer({
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

    const dom = pseudoDom.create(HtmlMock.parse(text))
    const expectedRaw = pseudoDetector.find(dom.root, {})
    const actualRaw = pseudoFlat.find(dom.root)
    console.log(Object.keys(actualRaw).length + " " + Object.keys(expectedRaw).length)

    const actual: any[] = []
    const expected: any[] = []
    Object.values(actualRaw).forEach(key => {
        if (!expectedRaw.includes(key)) {
            const actualElement = dom.elementText(key)
            actual.push(key)
            const expectedKey = expectedRaw
                .filter(e => actualElement.includes(dom.elementText(e)) || dom.elementText(e).includes(actualElement))
                .sort((a, b) => dom.elementText(a).length - dom.elementText(b).length)[0] ?? -1
            expected.push(expectedKey)
        } else {
            actual.push(key)
            expected.push(key)
        }
    })
    Object.values(expectedRaw).forEach(key => {
        if (expected.includes(key)) return
        if (!actualRaw.includes(key)) {
            const expectedElement = dom.elementText(key)
            expected.push(key)
            const actualKey = actualRaw
                .filter(e => expectedElement.includes(dom.elementText(e)) || dom.elementText(e).includes(expectedElement))
                .sort((a, b) => dom.elementText(a).length - dom.elementText(b).length)[0] ?? -1
            actual.push(actualKey)
        }
    })

    const actualLine0 = actual
        .map(id => dom.elementText(id))
        .map(e => textFlat.find(e).map(ee => e.substring(ee.startIndex, ee.endIndex))[0])
        .map(e => e ? e.replace(/\s/g, ' ') : '')
    const actualLine1 = actual
        .map(id => dom.elementText(id))
        .map(e => textFlat.find(e).map(ee => e.substring(ee.startIndex, ee.endIndex))[1])
        .map(e => e ? e.replace(/\s/g, ' ') : '')

    const expectedLine0 = expected
        .map(id => dom.elementText(id))
        .map(e => textDetector.find(e).map(e => e.text)[0])
        .map(e => e ? e.replace(/\s/g, ' ') : '')
    const expectedLine1 = expected
        .map(id => dom.elementText(id))
        .map(e => textDetector.find(e).map(e => e.text)[1])
        .map(e => e ? e.replace(/\s/g, ' ') : '')

    const lengths = actualLine0.map((actual0, i) => Math.max(
        actual0?.length || 0,
        actualLine1[i]?.length || 0,
        expectedLine0[i]?.length || 0,
        expectedLine1[i]?.length || 0,
    ))
    const compareLine = actual.map((e, i) => e === expected[i] ? ''.padStart(lengths[i], ' ') : ''.padStart(lengths[i], '#'))
    console.log(`Verification
    ${actualLine0.map((e, i) => e.padStart(lengths[i], ' ')).join(', ')}
    ${actualLine1.map((e, i) => e.padStart(lengths[i], ' ')).join(', ')}
    ${compareLine.join(', ')}
    ${expectedLine0.map((e, i) => e.padStart(lengths[i], ' ')).join(', ')}
    ${expectedLine1.map((e, i) => e.padStart(lengths[i], ' ')).join(', ')}
    `)

    new Suite()
        .add(name + " pseudoDetector", () => pseudoDetector.find(dom.root, {}))
        .add(name + " pseudoFlat", () => pseudoFlat.find(dom.root))
        .on('cycle', (event: any) => console.log(String(event.target)))
        .run({async: false})
}