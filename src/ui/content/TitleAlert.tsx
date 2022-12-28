import * as React from 'react'
import styled from 'styled-components'
import { useProvider } from '../../di'
import { FooterText, ThemeHolder } from '../atoms'
import { Div } from '../atoms/Styled'

export function TitleAlert() {
	const { browser } = useProvider()
	return <Container>
		<MenuTitle>{ browser.extensionName }</MenuTitle>
	</Container>
}

const Container = styled( Div )<ThemeHolder>( ( props: ThemeHolder ) => ( {
	paddingTop: '10px',
	paddingBottom: '10px',
	borderWidth: '1px',
	backgroundColor: props.theme.containerBorder,
	color: props.theme.headerText,
	textAlign: 'center',
	height: 'fit-content',
} ) )

const MenuTitle = styled( FooterText )<ThemeHolder>`
  color: ${ ( props ) => props.theme.normalText };
  background-color: ${ ( props ) => props.theme.containerBorder };
`
