import { MockStrategy } from 'sharp-dependency-injection'
import { ActiveLocalization } from '../src/currencyConverter/Localization'
import { SyncSetting } from '../src/infrastructure/Configuration/setting/SyncSetting'
import useMockContainer from './Container.mock'

describe( 'ActiveLocalization', () => {
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
			} = useMockContainer()
			const setting = new SyncSetting<string>( { browser }, '', '', () => true )
			const localization = currencyLocalization.create( {
				key: '',
				setting,
			} )


			// Act
			localization.override( test.input )

			// Assert
			expect( localization.value ).toBe( test.expect )
		} ),
	);

	[
		{
			input: 'AAA',
			expect: true,
		},
		{
			input: '',
			expect: false,
		},
	].forEach( ( test ) =>
		it( `Conflict ${ test.input } => ${ test.expect }`, () => {
			// Setup
			const {
				browser,
				currencyLocalization,
			} = useMockContainer()
			const setting = new SyncSetting<string>( { browser }, '', '', () => true )
			const localization = currencyLocalization.create( {
				key: '',
				setting,
			} )
			localization.setDetected( test.input )

			// Assert
			expect( localization.hasConflict() ).toBe( test.expect )
		} ),
	)

	it( `Save`, async () => {
		// Setup
		const { activeLocalization } = useMockContainer( {
			currencyLocalization: MockStrategy.realValue,
		} )

		jest.spyOn( activeLocalization.krone, 'save' )
		const kroneSpy = jest.spyOn( activeLocalization.krone, 'save' )
		const yenSpy = jest.spyOn( activeLocalization.yen, 'save' )
		const dollarSpy = jest.spyOn( activeLocalization.dollar, 'save' )

		// Act
		await activeLocalization.save()

		// Assert
		expect( kroneSpy ).toBeCalledTimes( 1 )
		expect( yenSpy ).toBeCalledTimes( 1 )
		expect( dollarSpy ).toBeCalledTimes( 1 )
	} )
} )
