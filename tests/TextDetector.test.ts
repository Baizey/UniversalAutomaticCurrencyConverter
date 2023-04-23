import { MockStrategy } from '@baizey/dependency-injection'
import { TextDetector } from '../src/currencyConverter/Detection'
import useMockContainer from './Container.mock'

describe( 'TextDetector', () => {
	const tests = [
		{
			text: `$3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: '$3.99',
					currencies: [ '$', '' ],
				},
			],
		},
		{
			text: `3.99`,
			expect: [],
		},
		{
			text: `$3.99 . $3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: '$3.99 .',
					currencies: [ '$', '' ],
				},
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: ' $3.99',
					currencies: [ '$', '' ],
				},
			],
		},
		{
			text: `$3.99 $3.99`,
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: '$3.99 ',
					currencies: [ '$', '' ],
				},
				{
					amounts: [ {
						neg: '+',
						integer: '3',
						decimal: '99',
					} ],
					text: ' $3.99',
					currencies: [ '$', '' ],
				},
			],
		},
		/* TODO: make this detect properly
		{
			text: `$3.99$3.99`, expect: [{
				amounts: [{neg: '+', integer: '3', decimal: '99'}],
				text: '$3.',
				currencies: ['$', '$']
			}, {
				amounts: [{neg: '+', integer: '3', decimal: '99'}],
				text: '.99',
				currencies: ['$', '']
			}]
		},
		 */
		{
			text: `$3.99 - 3.99`,
			expect: [
				{
					amounts: [
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
					],
					text: '$3.99 - 3.99',
					currencies: [ '$', '' ],
				},
			],
		},
		{
			text: `$3.99-3.99`,
			expect: [
				{
					amounts: [
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
						{
							neg: '+',
							integer: '3',
							decimal: '99',
						},
					],
					text: '$3.99-3.99',
					currencies: [ '$', '' ],
				},
			],
		},
		{
			text: `3.99-3.99`,
			expect: [],
		},
		{
			name: 'invis char',
			text: '‎$34.99',
			expect: [
				{
					amounts: [ {
						neg: '+',
						integer: '34',
						decimal: '99',
					} ],
					text: '‎$34.99',
					currencies: [ '$', '' ],
				},
			],
		},
	]
	tests.forEach(
		( test: {
			name?: string;
			expect: { amounts: any; text: string; currencies: string[] }[];
			text: string;
		} ) => {
			it( `${ test.name || test.text }`, async () => {
				// Setup
				const provider = useMockContainer( {
					backendApi: { symbols: async () => ( { USD: 'USD' } ) },
				}, MockStrategy.realValue )
				await provider.activeLocalization.load()
				await provider.activeLocalization.overload( { dollar: 'USD' } )
				const detector = provider.textDetector

				// Act
				const actual = detector.find( test.text )

				// Assert
				for ( let i = 0; i < test.expect.length; i++ ) {
					expect( actual[i]?.text ).toBe( test.expect[i].text )
					expect( actual[i]?.currencies ).toStrictEqual(
						test.expect[i].currencies,
					)
					expect( actual[i]?.amounts ).toStrictEqual( test.expect[i]?.amounts )
				}
				expect( actual.length ).toBe( test.expect.length )
			} )
		},
	)
} )
