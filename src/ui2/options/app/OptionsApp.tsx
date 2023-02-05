import { JSX } from 'preact'
import { Div, Percent, Pixel, Space, useTheme, WithChildren } from '../../atoms'
import { useIsLoading } from '../../atoms/contexts/ConfigurationProvider'
import { AccessibilityCard } from '../accessibility/AccessibilityCard'
import { CurrencyCard } from '../currency/CurrencyCard'
import { FilterOptionsCard, NewUpdateCard, TitleCard } from '../misc'
import { LoadingCard } from '../shared'
import { VisualsCard } from '../visual/VisualsCard'

const Background = ( { children }: WithChildren ) =>
	<Div style={ {
		minHeight: Percent.all,
		height: 'fit-content',
		margin: 0,
		backgroundColor: useTheme().wrapperBackground,
	} }>{ children }</Div>

const Wrapper = ( { children }: WithChildren ) =>
	<Div style={ {
		maxWidth: Pixel.of( 800 ),
		backgroundColor: useTheme().wrapperBackground,
	} }>{ children }</Div>

export function OptionsApp() {
	if ( useIsLoading() ) return wrap( <LoadingCard key="LoadingCard-card"/> )

	function wrap( children: JSX.Element[] | JSX.Element ) {
		return (
			<Background>
				<Space height={ Pixel.of( 10 ) }/>
				<Wrapper>
					<TitleCard key="TitleCard-card"/>
					<NewUpdateCard/>
					<FilterOptionsCard/>
					{ children }
				</Wrapper>
				<Space height={ Pixel.of( 10 ) }/>
			</Background>
		)
	}

	return wrap( [
		<CurrencyCard key="CurrencyCard-card"/>,
		<VisualsCard key="VisualsCard-card"/>,
		<AccessibilityCard key="AccessibilityCard-card"/>,
	] )
}