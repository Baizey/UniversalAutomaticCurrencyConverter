import React from 'react'
import { MockStrategy } from 'sharp-dependency-injection'
import styled, { ThemeProvider } from 'styled-components'
import { mapToTheme, themes } from '../src/infrastructure'
import { darkTheme } from '../src/infrastructure/Theme/DarkTheme'
import { lightTheme } from '../src/infrastructure/Theme/LightTheme'
import { Percent } from '../src/ui/atoms'
import useMockContainer from '../tests/Container.mock'

enum ScreenType {
	content = 'content',
	options = 'options',
	popup = 'popup'
}

export const parameters = {
	backgrounds: {
		default: 'light theme',
		values: [
			{
				name: 'dark theme',
				value: darkTheme.wrapperBackground,
			},
			{
				name: 'light theme',
				value: lightTheme.wrapperBackground,
			},
		],
	},
	actions: { argTypesRegex: '^on[A-Z].*' },
	controls: {
		matchers: {
			color: /(background|color)$/i,
			date: /Date$/,
		},
	},
}

// noinspection JSUnusedGlobalSymbols
export const globalTypes = {
	width: {
		name: 'Width',
		description: 'Global width for components',
		defaultValue: 'options',
		toolbar: {
			icon: 'zoom',
			items: Object.values( ScreenType ),
		},
	},
}

const Wrapper = styled.div<{ color: string }>( ( props ) => ( {
	minWidth: '100vh',
	minHeight: '100vh',
	height: Percent.all,
	width: Percent.all,
	backgroundColor: props.color,
	margin: 0,
	padding: 0,
} ) )

const InnerWrapperPopup = styled.div`
  width: 600px;
  height: fit-content;
  padding: 20px;
  border-width: 1px;
  margin: auto;
`

const InnerWrapperOptions = styled.div`
  max-width: 800px;
  margin: auto;
  border: 0;
`

const InnerWrapperContent = styled.div`
  width: 450px;
  height: fit-content;
  z-index: 99999;
  right: 10px;
  top: 10px;
  position: fixed;
`

export const decorators = [
	( Story, context ) => {
		const backgroundColor = context.globals.backgrounds?.value ?? lightTheme.wrapperBackground
		const theme: keyof typeof themes = ( backgroundColor === darkTheme.wrapperBackground )
			? 'darkTheme'
			: 'lightTheme'
		const screenType = context.globals.width.toLowerCase() as ScreenType

		const { metaConfig: { colorTheme } } = useMockContainer( MockStrategy.realValue )
		colorTheme.setValue( theme )

		function findUsedBackgroundColor() {
			switch ( screenType ) {
				case ScreenType.content:
					return '#AAA'
				default:
				case ScreenType.options:
				case ScreenType.popup:
					return backgroundColor
			}
		}

		function findInnerWrap() {
			switch ( screenType ) {
				case ScreenType.content:
					return InnerWrapperContent
				case ScreenType.popup:
					return InnerWrapperPopup
				default:
				case ScreenType.options:
					return InnerWrapperOptions
			}
		}

		const Inner = findInnerWrap()
		return (
			<ThemeProvider theme={ mapToTheme( colorTheme.value ) }>
				<Wrapper color={ findUsedBackgroundColor() }>
					<Inner>
						<Story/>
					</Inner>
				</Wrapper>
			</ThemeProvider>
		)
	},
]