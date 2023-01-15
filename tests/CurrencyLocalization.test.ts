import { MockStrategy } from 'sharp-dependency-injection'
import { CurrencyLocalization } from '../src/currencyConverter/Localization/CurrencyLocalization'
import { SyncSetting } from '../src/infrastructure/Configuration/setting/SyncSetting'
import useMockContainer from './Container.mock'

describe( 'CurrencyLocalization', () => {
	[
		{
			input: 'AAA',
			expect: 'AAA',
		},
		{
			input: 'AAAA',
			expect: '',
		},
		{
			input: 'AA',
			expect: '',
		},
		{
			input: 'Q.Q',
			expect: '',
		},
		{
			input: 'USD',
			expect: 'USD',
		},
		{
			input: '123',
			expect: '',
		},
		{
			input: 'aaa',
			expect: '',
		},
		{
			input: 'aaaa',
			expect: '',
		},
	].forEach( ( test ) =>
		it( `Override ${ test.input } => ${ test.expect }`, () => {
			// Setup
			const {
				browser,
				currencyLocalization,
			} = useMockContainer( MockStrategy.realValue )
			const setting = new SyncSetting<string>( { browser }, '', '', () => true )
			const localization = currencyLocalization.create( {
				key: '',
				setting,
			} )

			// Act
			localization.override( test.input )

			// Assert
			expect( localization.key ).toBe( test.expect )
		} ),
	);

	[
		{
			input: 'AAA',
			default: 'BBB',
			expect: true,
		},
		{
			input: 'CCC',
			default: 'CCC',
			expect: false,
		},
	].forEach( ( test ) =>
		it( `Conflict ${ test.input } => ${ test.expect }`, () => {
			// Setup
			const {
				browser,
				currencyLocalization,
			} = useMockContainer( MockStrategy.realValue )
			const setting = new SyncSetting<string>( { browser }, '', '', () => true )
			const localization = currencyLocalization.create( {
				key: '',
				setting,
			} )
			localization.defaultValue = test.default
			localization.setDetected( test.input )

			// Assert
			expect( localization.hasConflict() ).toBe( test.expect )
		} ),
	)

	it( `Save`, async () => {
		// Setup
		const {
			browser,
			currencyLocalization,
		} = useMockContainer( MockStrategy.realValue )
		const setting = new SyncSetting<string>( { browser }, '', '', () => true )
		const localization = currencyLocalization.create( {
			key: 'key',
			setting,
		} )
		const spy = jest.spyOn( browser, 'saveLocal' )

		// Act
		await localization.save()

		// Assert
		expect( spy ).toBeCalledWith( 'key', '' )
	} )
} )
