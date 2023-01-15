import React from 'react'
import styled from 'styled-components'
import { useProvider } from '../../../di'
import {
	ButtonGrid,
	Div,
	Link,
	Pixel,
	PrimaryButton,
	SecondaryButton,
	Space,
	ThemeHolder,
	Title,
	useConfiguration,
} from '../../atoms'
import { Converter } from '../Converter'

export function PopupApp() {
	const { isLoading } = useConfiguration()
	if ( isLoading ) return <Title>Loading...</Title>
	const {
		browser,
		tabMessenger,
	} = useProvider()

	return <Container>
		<Title>Universal Automatic Currency Converter</Title>
		<Converter/>
		<Space height={ Pixel.halfField }/>
		<ButtonGrid>
			<SecondaryButton onClick={ () => tabMessenger.openContextMenu() }>
				Open context menu
			</SecondaryButton>
			<PrimaryButton onClick={ () => window.open( './options.html', '_blank' ) }>
				Go to settings
			</PrimaryButton>
		</ButtonGrid>
		<Footer>Like or hate this extension?</Footer>
		<Footer><Link href={ browser.reviewLink } target="_blank">Leave a review</Link></Footer>
		<Footer>{ `Version ${ browser.extensionVersion } created by ${ browser.author }` }</Footer>
	</Container>
}

const Container = styled( Div )`
  max-width: calc(100% - 20px);
  width: 600px;
  height: fit-content;
  padding: 20px;
  border-width: 1px;
`

const Footer = styled( Div )`
  margin: auto;
  text-align: center;
  color: ${ ( { theme }: ThemeHolder ) => theme.footerText };
`
