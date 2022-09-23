import { MockStrategy } from 'sharp-dependency-injection'
import { CurrencyRate } from '../src/currencyConverter/BackendApi/CurrencyRate'
import { CurrencyElement } from '../src/currencyConverter/Currency'
import useMockContainer from './Container.mock'
import { HtmlMock } from './Html.mock'

describe( 'CurrencyElement', () => {
	const tests = [
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
				HtmlMock.parse( `<span id="price_inside_buybox" class="a-size-medium a-color-price" style="">
        22,99&nbsp;€
    </span>` ),
		},
		{
			name: 'bracket range',
			expect: '5 - 5 USD (5 - 5 USD)',
			showInBrackets: true,
			element: HtmlMock.parse( `<div>5 - 5 USD</div>` ),
		},
		{
			name: 'bracket negative number',
			expect: '-5 USD (-5 USD)',
			showInBrackets: true,
			element: HtmlMock.parse( `<div>-5 USD</div>` ),
		},
		{
			name: 'bracket negative number',
			expect: '-5 - -5 USD (-5 - -5 USD)',
			showInBrackets: true,
			element: HtmlMock.parse( `<div>-5 - -5 USD</div>` ),
		},
	]
	tests.forEach(
		( test: {
			name: string;
			expect: string;
			element: HTMLElement;
			showInBrackets?: boolean;
		} ) => {
			it( `${ test.name }`, async () => {
				// Setup
				const {
					activeLocalization,
					currencyTagConfig,
					currencyElement,
				} = useMockContainer( {
					backendApi: {
						symbols: async (): Promise<Record<string, string>> =>
							Promise.resolve( {
								USD: 'USD',
								EUR: 'EUR',
							} ),
						rate: async ( from: string, to: string ) =>
							Promise.resolve( new CurrencyRate( from, to, 1, Date.now(), [] ) ),
					},
				}, MockStrategy.realValue )
				await activeLocalization.load()
				await activeLocalization.overload( { dollar: 'USD' } )
				currencyTagConfig.showConversionInBrackets.setValue( test.showInBrackets )
				const actual = currencyElement.create( test.element )

				// Act
				await actual.convertTo( 'USD' )

				// Assert
				// @ts-ignore
				expect( actual.converted.texts.join( ' ' ) ).toBe( test.expect )
			} )
		},
	)
} )
