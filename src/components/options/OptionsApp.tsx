import * as React from 'react'
import styled from 'styled-components'
import { ThemeProps } from '../../infrastructure'
import { Div, Space } from '../atoms'
import { useConfiguration } from '../molecules'
import { AccessibilityCard } from './Accessibility/AccessibilityCard'
import { CurrencyCard } from './Currency/CurrencyCard'
import { FilterOptionsCard } from './FilterOptionsCard'
import { NewUpdateCard } from './NewUpdateCard'
import { LoadingCard } from './Shared'
import { TitleCard } from './TitleCard'
import { VisualsCard } from './Visual/VisualsCard'

export default function OptionsApp(): JSX.Element {
	const { isLoading } = useConfiguration()
	if ( isLoading ) return wrap( <LoadingCard key="LoadingCard-card"/> )

	function wrap( children: JSX.Element[] | JSX.Element ) {
		return (
			<Background>
				<Space height={ 10 }/>
				<Wrapper>
					<TitleCard key="TitleCard-card"/>
					<NewUpdateCard/>
					<FilterOptionsCard/>
					{ children }
				</Wrapper>
				<Space height={ 10 }/>
			</Background>
		)
	}

	return wrap( [
		<CurrencyCard key="CurrencyCard-card"/>,
		<VisualsCard key="VisualsCard-card"/>,
		<AccessibilityCard key="AccessibilityCard-card"/>,
	] )
}

const Background = styled( Div )<ThemeProps>`
  min-height: 100%;
  height: fit-content;
  background-color: ${ ( props: ThemeProps ) => props.theme.wrapperBackground };
  margin: 0;
`

const Wrapper = styled( Div )`
  background-color: ${ ( props: ThemeProps ) => props.theme.wrapperBackground };
  max-width: 800px;
`
