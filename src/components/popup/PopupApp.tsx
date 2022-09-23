import * as React from 'react'
import styled from 'styled-components'
import { useProvider } from '../../di'
import { ThemeProps } from '../../infrastructure'
import { Div, Link, PrimaryButton, SecondaryButton, Space, Title } from '../atoms'
import { useConfiguration } from '../molecules'
import { Converter } from './Converter'

export default function PopupApp() {
	const { isLoading } = useConfiguration()
	if ( isLoading ) return <Title>Loading...</Title>
	const {
		browser,
		tabMessenger,
	} = useProvider()

	return (
		<Container>
			<Title>Universal Automatic Currency Converter</Title>

			<Converter/>

			<Space height={ 20 }/>

			<SecondaryButton
				onClick={ () => {
					tabMessenger.openContextMenu()
				} }
				connect={ { down: true } }
			>
				Open context menu
			</SecondaryButton>

			<Link href="./options.html" target="_blank">
				<PrimaryButton connect={ { up: true } }>Go to settings</PrimaryButton>
			</Link>

			<Footer>Like or hate this extension?</Footer>
			<Footer>
				<Link href={ browser.reviewLink } target="_blank">
					Leave a review
				</Link>
			</Footer>
			<Footer>{ `Version ${ browser.extensionVersion } created by ${ browser.author }` }</Footer>
		</Container>
	)
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
  color: ${ ( props: ThemeProps ) => props.theme.footerText };
`
