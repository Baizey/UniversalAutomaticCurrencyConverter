import { JSX } from 'preact'
import { Percent, Pixel, Space, useTheme } from '../../atoms'
import { AccessibilityCard } from '../accessibility/AccessibilityCard'
import { CurrencyCard } from '../currency/CurrencyCard'
import { FilterOptionsCard, NewUpdateCard, TitleCard } from '../misc'
import { VisualsCard } from '../visual/VisualsCard'
import {PropsWithChildren} from "preact/compat";
import {Div} from "@baizey/styled-preact";

const Background = ( { children }: PropsWithChildren ) =>
	<Div style={ {
		minHeight: Percent.all,
		height: 'fit-content',
		margin: 0,
		backgroundColor: useTheme().wrapperBackground,
	} }>{ children }</Div>

const Wrapper = ( { children }: PropsWithChildren ) =>
	<Div style={ {
		maxWidth: Pixel.of( 800 ),
		backgroundColor: useTheme().wrapperBackground,
	} }>{ children }</Div>

export function OptionsApp() {
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