import { MockStrategy } from 'sharp-dependency-injection'
import { CurrencyElement } from '../src/currencyConverter/Currency'
import { TabState } from '../src/currencyConverter/Live/TabState'
import useMockContainer from './Container.mock'
import { HtmlMock } from './Html.mock'

describe( 'TabInformation', () => {
	it( `is allowed`, () => {
		// Setup
		const tabInfo = new TabState()
		tabInfo.setIsAllowed( true )

		expect( tabInfo.isAllowed ).toBe( true )
		// Assert
		expect( tabInfo.isAllowed ).toBe( true )
	} )
	it( `is not allowed`, () => {
		// Setup
		const tabInfo = new TabState()
		tabInfo.setIsAllowed( false )

		// Assert
		expect( tabInfo.isAllowed ).toBe( false )
	} )

	it( `is showing conversions`, () => {
		// Setup
		const tabInfo = new TabState()
		tabInfo.setIsShowingConversions( true )

		// Assert
		expect( tabInfo.isShowingConversions ).toBe( true )
	} )

	it( `is not showing conversions after flip`, () => {
		// Setup
		const provider = useMockContainer()
		const tabInformation = provider.tabState
		tabInformation.conversions.push(
			new CurrencyElement( provider, HtmlMock.empty() ),
		)
		tabInformation.setIsShowingConversions( true )

		// Act
		tabInformation.flipAllConversions()

		// Assert
		expect( tabInformation.isShowingConversions ).toBe( false )
	} )

	it( `is not showing hovered conversions after flip`, () => {
		// Setup
		const {
			qualityOfLifeConfig,
			tabState,
			currencyElement,
		} = useMockContainer( MockStrategy.realValue )
		qualityOfLifeConfig.keyPressOnHoverFlipConversion.setValue( 'Shift' )
		const element = currencyElement.create( HtmlMock.empty() )
		element.setupListener()
		tabState.conversions.push( element )
		element.isHovered = true
		tabState.setIsShowingConversions( true )

		// Act
		tabState.flipHovered()

		// Assert
		expect( element.isShowingConversion ).toBe( false )
	} )
} )
