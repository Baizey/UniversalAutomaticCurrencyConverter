import useMockContainer from './Container.mock';

describe('ElementDetector', () => {
    const create = (html: string): HTMLElement => {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.children[0] as HTMLElement;
    }
    const originalShowTest = [
        {
            name: 'Amazon one original',
            element: create(`<span class="a-price" data-a-size="l" data-a-color="base"><span class="a-offscreen">DKK&nbsp;21.44</span><span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span></span>`),
            expect: ['DKK 21.44', 'DKK21.44']
        },
        {
            name: 'Amazon hidden original',
            element: create(`<span class="a-offscreen">DKK&nbsp;21.44</span>`),
            expect: ['DKK 21.44']
        },
        {
            name: 'Amazon visible original',
            element: create(`<span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span>`),
            expect: ['DKK21.44']
        }
    ];
    originalShowTest.forEach((test: { name: string, element: HTMLElement, expect: any }) => {
        it(`${test.name}`, async () => {
            // Setup
            const [container, provider] = useMockContainer();
            await provider.activeLocalization.load()
            await provider.activeLocalization.overload({dollar: 'USD'})
            const elementDetector = provider.elementDetector;

            // Act
            const actual = elementDetector.find(test.element);
            await Promise.all(actual.map(e => e.showOriginal()));


            // Assert
            expect(actual.map(e => e.element.innerText)).toEqual(test.expect);
        });
    })

    const convertedShowTest = [
        {
            name: 'Amazon one converted',
            element: create(`<span class="a-price" data-a-size="l" data-a-color="base"><span class="a-offscreen">DKK&nbsp;21.44</span><span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span></span>`),
            expect: ['21 DKK', '21 DKK']
        },
        {
            name: 'Amazon hidden converted',
            element: create(`<span class="a-offscreen">DKK&nbsp;21.44</span>`),
            expect: ['21 DKK']
        },
        {
            name: 'Amazon visible converted',
            element: create(`<span aria-hidden="true"><span class="a-price-symbol">DKK</span><span class="a-price-whole">21<span class="a-price-decimal">.</span></span><span class="a-price-fraction">44</span></span>`),
            expect: ['21 DKK']
        }
    ];
    convertedShowTest.forEach((test: { name: string, element: HTMLElement, expect: any }) => {
        it(`${test.name}`, async () => {
            // Setup
            const [container, provider] = useMockContainer();
            await provider.activeLocalization.load()
            await provider.activeLocalization.overload({dollar: 'USD', krone: 'DKK'})
            const elementDetector = provider.elementDetector;

            // Act
            const actual = elementDetector.find(test.element);
            await Promise.all(actual.map(e => e.convertTo('DKK')));
            await Promise.all(actual.map(e => e.showConverted()));


            // Assert
            expect(actual.map(e => e.element.innerText)).toEqual(test.expect);
        });
    })
});